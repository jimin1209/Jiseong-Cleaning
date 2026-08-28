"use server";

import { revalidatePath } from "next/cache";
import { copy } from "@/lib/copy";
import { publishLiveCopy } from "@/lib/copy-live";
import {
  getCopyDraft,
  setCopyDraftStatus,
  type CopyDraftStatus,
} from "@/lib/copy-drafts";

/**
 * 제안 게시판의 서버 액션.
 *
 * 상태(제안·채택·반영)는 진행 상황 라벨이고, 「이 안을 사이트에 반영」이
 * 실제 게시다 — 안의 수정 내용을 게시본(copy-live.ts)에 얹어 방문자 화면을
 * 바꾼다. 개발자가 copy.ts 를 고칠 필요가 없다.
 */

const STATUSES: CopyDraftStatus[] = ["제안", "채택", "반영"];

export async function setDraftStatusAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as CopyDraftStatus;
  if (!Number.isInteger(id) || !STATUSES.includes(status)) return;

  await setCopyDraftStatus(id, status);
  revalidatePath("/admin/proposals");
}

/** 안의 수정 내용을 사이트에 게시하고 상태를 「반영」으로 바꾼다 */
export async function applyDraftAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const draft = await getCopyDraft(id);
  if (!draft) return;

  const entries: Record<string, string> = {};
  const removeKeys: string[] = [];
  for (const edit of draft.edits) {
    // 지금 코드에 없는 키(문구 구조가 바뀐 옛 안)는 건너뛴다
    if (copy[edit.key] === undefined) continue;
    // 코드 원문과 같아진 값은 게시본에서 빼서 원문으로 되돌린다
    if (edit.proposed === copy[edit.key]) removeKeys.push(edit.key);
    else entries[edit.key] = edit.proposed;
  }

  await publishLiveCopy(entries, removeKeys);
  await setCopyDraftStatus(id, "반영");

  revalidatePath("/", "layout");
  revalidatePath("/admin/proposals");
  revalidatePath("/admin/edit");
}
