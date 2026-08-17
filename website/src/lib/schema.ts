import { z } from "zod";
import {
  inquiryCycleOptions,
  inquiryIndustryOptions,
  inquiryItemOptions,
} from "./services";

/**
 * 견적 문의 검증 스키마.
 *
 * 서버에서만 신뢰한다 — 화면에서 넘어온 값은 반드시 여기를 통과해야 저장된다.
 * (설계서 1.3 「클라이언트가 보낸 값은 신뢰하지 않는다」와 같은 원칙)
 */

const trimmed = (max: number) => z.string().trim().max(max);

export const inquirySchema = z.object({
  company: trimmed(100).min(1, "업체명을 입력해 주세요."),

  industry: z.enum(inquiryIndustryOptions, {
    message: "업종을 선택해 주세요.",
  }),

  contactName: trimmed(50).min(1, "담당자 성명을 입력해 주세요."),

  phone: trimmed(30)
    .min(1, "연락처를 입력해 주세요.")
    // 010-0000-0000 / 054-621-5002 / 01000000000 을 모두 허용한다
    .regex(
      /^0\d{1,2}-?\d{3,4}-?\d{4}$/,
      "연락처를 010-0000-0000 형식으로 입력해 주세요.",
    ),

  email: z.union([z.literal(""), z.string().trim().email("이메일 형식을 확인해 주세요.")]),

  region: trimmed(120).min(1, "사업장 지역을 입력해 주세요."),

  items: z.array(z.enum(inquiryItemOptions)).default([]),

  volume: trimmed(300),

  cycle: z.union([z.literal(""), z.enum(inquiryCycleOptions)]),

  message: trimmed(2000),

  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === "on" || v === "true" || v === true, {
      message: "개인정보 수집·이용에 동의해 주세요.",
    }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** FormData → 검증. 체크박스 복수 선택을 배열로 모아 준다. */
export function parseInquiryForm(formData: FormData) {
  const raw = {
    company: formData.get("company") ?? "",
    industry: formData.get("industry") ?? "",
    contactName: formData.get("contactName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    region: formData.get("region") ?? "",
    items: formData.getAll("items").map(String),
    volume: formData.get("volume") ?? "",
    cycle: formData.get("cycle") ?? "",
    message: formData.get("message") ?? "",
    consent: formData.get("consent") ?? false,
  };

  return inquirySchema.safeParse(raw);
}

/** 필드별 첫 오류 메시지만 뽑아 화면에 돌려준다 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
