"use server";

import { redirect } from "next/navigation";
import { createPartnerSession } from "@/lib/auth/session";
import { saveDemoPartner } from "@/features/partners/repository";

export type PartnerLoginState = { error?: string };

export async function partnerLogin(
  _state: PartnerLoginState,
  formData: FormData,
): Promise<PartnerLoginState> {
  const companyName = String(formData.get("companyName") ?? "").trim();
  if (!companyName) return { error: "거래처명을 입력해 주세요." };
  if (companyName.length > 100) return { error: "거래처명은 100자 이하로 입력해 주세요." };

  const session = await createPartnerSession();
  saveDemoPartner(session.userId, companyName);
  redirect("/orders/new");
}
