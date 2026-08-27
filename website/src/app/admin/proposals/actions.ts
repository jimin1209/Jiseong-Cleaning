"use server";

import { revalidatePath } from "next/cache";
import { setCopyDraftStatus, type CopyDraftStatus } from "@/lib/copy-drafts";

/**
 * 안 상태 변경 (제안 게시판).
 *
 * "반영" 실행 버튼은 없다(수동 반영 원칙) — 상태는 회의 결과를 표시하는
 * 라벨일 뿐이고, 실제 문구 반영은 개발자가 copy.ts 를 고쳐서 한다.
 */

const STATUSES: CopyDraftStatus[] = ["제안", "채택", "반영"];

export async function setDraftStatusAction(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as CopyDraftStatus;
  if (!Number.isInteger(id) || !STATUSES.includes(status)) return;

  await setCopyDraftStatus(id, status);
  revalidatePath("/admin/proposals");
}
