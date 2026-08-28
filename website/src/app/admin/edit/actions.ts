"use server";

import { revalidatePath } from "next/cache";
import { copy } from "@/lib/copy";
import {
  clearLiveCopy,
  publishLiveCopy,
  readLiveCopy,
} from "@/lib/copy-live";
import {
  countCopyDrafts,
  saveCopyDraft,
  setCopyDraftStatus,
  updateCopyDraft,
  type CopyEdit,
} from "@/lib/copy-drafts";

/**
 * 편집 화면의 서버 액션 — 「제안 저장」과 「사이트에 반영」.
 *
 * /admin/* 은 proxy.ts 의 로그인·Basic 인증 뒤에 있고, 서버 액션 POST 도
 * /admin/edit 경로로 들어오므로 같은 인증이 걸린다.
 *
 * 기준 문구(original)는 클라이언트를 믿지 않고 서버에서 다시 읽는다 —
 * 게시본(copy-live)이 있으면 그 값이, 없으면 copy.ts 원문이 기준이다.
 */

/** 편집을 지원하는 페이지 — /admin/edit 의 페이지 선택지와 같아야 한다 */
const EDITABLE_PAGES = new Set(["home", "about", "services", "quote", "notfound"]);

/** 한 번에 다룰 수 있는 수정 개수 — 실수로 거대한 요청이 들어오는 것만 막는다 */
const MAX_EDITS = 500;
const MAX_LENGTH = 2000;

export type SaveCopyDraftResult =
  | { ok: true; id: number }
  | { ok: false; error: string };

export type PublishCopyResult =
  | { ok: true; count: number }
  | { ok: false; error: string };

/**
 * 제출된 수정안을 검증해 실제로 달라진 것만 추린다.
 * 기준값은 게시본 → copy.ts 순서로 찾는다.
 */
async function collectEdits(
  overrides: Record<string, string>,
): Promise<{ edits: CopyEdit[] } | { error: string }> {
  const { overrides: live } = await readLiveCopy();
  const entries = Object.entries(overrides ?? {});
  if (entries.length > MAX_EDITS) return { error: "수정 항목이 너무 많습니다." };

  const edits: CopyEdit[] = [];
  for (const [key, proposed] of entries) {
    // copy.ts 에 없는 키·형식이 아닌 값은 버린다 (오래된 안을 불러온 경우 등)
    if (typeof proposed !== "string" || copy[key] === undefined) continue;
    if (proposed.length > MAX_LENGTH) {
      return { error: `수정안이 너무 깁니다: ${key}` };
    }
    const original = live[key] ?? copy[key];
    if (proposed === original) continue;
    edits.push({ key, original, proposed });
  }
  return { edits };
}

export async function saveCopyDraftAction(input: {
  /** 있으면 그 안에 덮어쓰기, 없으면 새 안 */
  id?: number;
  title: string;
  page: string;
  /** 키 → 수정안 (편집 화면의 로컬 오버라이드 그대로) */
  overrides: Record<string, string>;
}): Promise<SaveCopyDraftResult> {
  if (!EDITABLE_PAGES.has(input.page)) {
    return { ok: false, error: "지원하지 않는 페이지입니다." };
  }

  const collected = await collectEdits(input.overrides);
  if ("error" in collected) return { ok: false, error: collected.error };
  const { edits } = collected;

  if (edits.length === 0) {
    return { ok: false, error: "저장할 수정이 없습니다. 텍스트를 먼저 고쳐 주세요." };
  }

  // 제목이 비면 "N안" 자동 번호 — 직접 입력한 제목이 항상 우선한다
  const title =
    input.title.trim().slice(0, 80) || `${(await countCopyDrafts()) + 1}안`;

  if (input.id !== undefined) {
    const updated = await updateCopyDraft(input.id, { title, page: input.page, edits });
    if (!updated) return { ok: false, error: "덮어쓸 안을 찾지 못했습니다." };
    return { ok: true, id: input.id };
  }

  const id = await saveCopyDraft({ title, page: input.page, edits });
  return { ok: true, id };
}

/**
 * 편집 중인 수정을 사이트에 바로 반영한다.
 *
 * 게시본(copy-live)에 저장하고 화면 캐시를 무효화하면 그 순간부터
 * 방문자에게 새 문구가 나간다. 개발자가 코드를 고칠 필요가 없다.
 * 되돌릴 수 있도록 반영 내역을 「반영」 상태의 안으로도 남긴다.
 */
export async function publishCopyAction(input: {
  page: string;
  overrides: Record<string, string>;
  /** 안 제목 — 반영 내역에 남는 이름 */
  title?: string;
}): Promise<PublishCopyResult> {
  if (!EDITABLE_PAGES.has(input.page)) {
    return { ok: false, error: "지원하지 않는 페이지입니다." };
  }

  const collected = await collectEdits(input.overrides);
  if ("error" in collected) return { ok: false, error: collected.error };
  const { edits } = collected;

  if (edits.length === 0) {
    return { ok: false, error: "반영할 수정이 없습니다. 텍스트를 먼저 고쳐 주세요." };
  }

  // 코드 원문과 같아진 키는 게시본에서 빼서 원문으로 되돌린다
  const entries: Record<string, string> = {};
  const removeKeys: string[] = [];
  for (const e of edits) {
    if (e.proposed === copy[e.key]) removeKeys.push(e.key);
    else entries[e.key] = e.proposed;
  }

  await publishLiveCopy(entries, removeKeys);

  // 반영 이력 — 무엇을 언제 바꿨는지 게시판에 남는다
  const title =
    input.title?.trim().slice(0, 80) || `${(await countCopyDrafts()) + 1}안`;
  const id = await saveCopyDraft({ title, page: input.page, edits });
  await setCopyDraftStatus(id, "반영");

  revalidateSite();
  return { ok: true, count: edits.length };
}

/** 게시본을 통째로 지운다 — 사이트 문구가 코드 원문으로 완전히 돌아간다 */
export async function revertAllCopyAction(): Promise<PublishCopyResult> {
  const { overrides } = await readLiveCopy();
  const count = Object.keys(overrides).length;
  if (count === 0) {
    return { ok: false, error: "이미 원문 상태입니다. 되돌릴 반영이 없습니다." };
  }

  await clearLiveCopy();
  revalidateSite();
  return { ok: true, count };
}

/** 반영 즉시 방문자 화면이 바뀌도록 공개 경로 캐시를 무효화한다 */
function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/edit");
  revalidatePath("/admin/proposals");
}
