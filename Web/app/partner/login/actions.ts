"use server";

import { redirect } from "next/navigation";
import { createPartnerSession } from "@/lib/auth/session";
import { findOrCreateDemoPartner } from "@/features/partners/repository";

export type PartnerLoginState = { error?: string };

export async function partnerLogin(
  _state: PartnerLoginState,
  formData: FormData,
): Promise<PartnerLoginState> {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const partnerCode = String(formData.get("partnerCode") ?? "");
  if (!companyName) return { error: "거래처명을 입력해 주세요." };
  if (companyName.length > 100) return { error: "거래처명은 100자 이하로 입력해 주세요." };

  try {
    const partner = findOrCreateDemoPartner(companyName, partnerCode);
    await createPartnerSession(partner.userId);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "거래처 로그인에 실패했습니다.",
    };
  }

  redirect("/dashboard");
}
