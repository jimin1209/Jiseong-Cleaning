"use server";

import { saveInquiry } from "@/lib/inquiries";
import { sendInquiryMail } from "@/lib/mail";
import { fieldErrors, parseInquiryForm } from "@/lib/schema";
import type { QuoteState } from "@/lib/quote-state";

/**
 * 견적 문의 접수.
 *
 * 저장을 먼저 하고 메일을 나중에 보낸다. 메일은 SMTP 계정이 아직 없어
 * 실패하거나 건너뛸 수 있는데, 그것 때문에 접수가 취소되면 안 된다.
 */
export async function submitQuote(
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  const values: Record<string, string | string[]> = {
    company: String(formData.get("company") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    region: String(formData.get("region") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") ? "on" : "",
  };

  const parsed = parseInquiryForm(formData);

  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), values };
  }

  let id: number;
  try {
    id = await saveInquiry(parsed.data);
  } catch (err) {
    console.error("[inquiry] 저장 실패", err);
    return {
      status: "error",
      errors: {
        form: "접수 처리 중 문제가 발생했습니다. 전화로 연락 주시면 바로 상담해 드립니다.",
      },
      values,
    };
  }

  // 저장은 끝났으므로 메일 결과와 무관하게 접수 성공으로 응답한다
  await sendInquiryMail(parsed.data, id);

  return { status: "ok", errors: {}, values: {}, id };
}
