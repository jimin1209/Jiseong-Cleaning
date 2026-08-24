import nodemailer from "nodemailer";
import type { InquiryInput } from "./schema";
import { site } from "./site";

/**
 * 문의 알림 메일.
 *
 * SMTP 계정이 확정되지 않았으므로 환경변수가 없으면 **조용히 건너뛴다.**
 * 저장(lib/inquiries.ts)은 이미 끝난 뒤에 호출되므로 메일 실패가 접수를 막지 않는다.
 *
 * 계정이 정해지면 .env 에 아래 5개만 채우면 그 시점부터 발송된다.
 *   SMTP_HOST · SMTP_PORT · SMTP_USER · SMTP_PASS · INQUIRY_TO
 *
 * 회사 메일·네이버·구글 모두 SMTP를 지원하므로 별도 서비스 가입이 필요 없다.
 */

export type MailResult =
  | { sent: true }
  | { sent: false; reason: "not-configured" }
  | { sent: false; reason: "error"; message: string };

function isConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.INQUIRY_TO,
  );
}

const label: Record<string, string> = {
  company: "업체명",
  industry: "업종",
  contactName: "담당자",
  phone: "연락처",
  email: "이메일",
  region: "사업장 지역",
  items: "세탁 품목",
  volume: "예상 물량",
  cycle: "희망 수거 날짜",
  message: "문의 내용",
};

function toRows(input: InquiryInput): [string, string][] {
  return [
    ["company", input.company],
    ["industry", input.industry],
    ["contactName", input.contactName],
    ["phone", input.phone],
    ["email", input.email || "—"],
    ["region", input.region],
    ["items", input.items.length ? input.items.join(", ") : "—"],
    ["volume", input.volume || "—"],
    ["cycle", input.cycle || "—"],
    ["message", input.message || "—"],
  ].map(([k, v]) => [label[k] ?? k, v]);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendInquiryMail(
  input: InquiryInput,
  id: number,
): Promise<MailResult> {
  if (!isConfigured()) {
    // 개발·미설정 환경: 접수 내용을 서버 로그로 남겨 확인할 수 있게 한다
    console.info(
      `[inquiry] SMTP 미설정 — 메일을 보내지 않았습니다. 접수 #${id} ${input.company} / ${input.phone}`,
    );
    return { sent: false, reason: "not-configured" };
  }

  const rows = toRows(input);

  const text = [
    `${site.name} 견적 문의 (#${id})`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `접수 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
  ].join("\n");

  const html = `
    <div style="font-family:'Malgun Gothic',sans-serif;color:#152238;line-height:1.7">
      <h2 style="margin:0 0 4px;font-size:18px;color:#14306E">
        ${site.name} 견적 문의 <span style="color:#69798F">#${id}</span>
      </h2>
      <p style="margin:0 0 18px;font-size:13px;color:#69798F">
        ${escapeHtml(new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }))}
      </p>
      <table style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <th style="text-align:left;padding:8px 16px 8px 0;color:#69798F;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</th>
            <td style="padding:8px 0;border-bottom:1px solid #DCE5F0">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>`;

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });

    await transport.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: process.env.INQUIRY_TO,
      replyTo: input.email || undefined,
      subject: `[견적 문의] ${input.company} (${input.industry}) · ${input.contactName}`,
      text,
      html,
    });

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // 접수는 이미 저장됐으므로 사용자에게는 성공으로 안내하고, 실패만 기록한다
    console.error(`[inquiry] 메일 발송 실패 (접수 #${id}): ${message}`);
    return { sent: false, reason: "error", message };
  }
}
