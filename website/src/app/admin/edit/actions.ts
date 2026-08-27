"use server";

import { copy } from "@/lib/copy";
import {
  countCopyDrafts,
  saveCopyDraft,
  updateCopyDraft,
  type CopyEdit,
} from "@/lib/copy-drafts";

/**
 * 편집 화면의 "제안 저장" 서버 액션.
 *
 * /admin/* 은 proxy.ts 의 basic 인증 뒤에 있고, 서버 액션 POST 도
 * /admin/edit 경로로 들어오므로 같은 인증이 걸린다.
 *
 * 원문(original)은 클라이언트를 믿지 않고 서버의 copy.ts 에서 다시 읽는다 —
 * 저장 시점 기준의 원문 vs 수정안이 게시판에 남는다.
 */

/** 편집을 지원하는 페이지 — /admin/edit 의 페이지 선택지와 같아야 한다 */
const EDITABLE_PAGES = new Set(["home", "about", "services", "quote"]);

export type SaveCopyDraftResult =
  | { ok: true; id: number }
  | { ok: false; error: string };

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

  const entries = Object.entries(input.overrides ?? {});
  if (entries.length > 500) {
    return { ok: false, error: "수정 항목이 너무 많습니다." };
  }

  const edits: CopyEdit[] = [];
  for (const [key, proposed] of entries) {
    // copy.ts 에 없는 키·형식이 아닌 값은 버린다 (오래된 안을 불러온 경우 등)
    if (typeof proposed !== "string" || copy[key] === undefined) continue;
    if (proposed.length > 2000) {
      return { ok: false, error: `수정안이 너무 깁니다: ${key}` };
    }
    if (proposed === copy[key]) continue;
    edits.push({ key, original: copy[key], proposed });
  }

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
