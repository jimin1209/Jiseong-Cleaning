"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "./icons";
import { Alert, Button } from "./ui";
import {
  inquiryCycleOptions,
  inquiryIndustryOptions,
  inquiryItemOptions,
} from "@/lib/services";
import { submitQuote } from "@/app/quote/actions";
import { initialQuoteState, type QuoteState } from "@/lib/quote-state";
import { site } from "@/lib/site";

/* ── 필드 ─────────────────────────────────────────────── */

const inputClass =
  "w-full rounded-brand border-[1.5px] border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors duration-150 placeholder:text-faint hover:border-sky focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/18";

const errorClass = "border-danger ring-3 ring-danger/13";

function Field({
  name,
  label,
  required,
  hint,
  error,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[0.8125rem] font-bold text-ink"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${name}-error`}
          className="mt-1.5 flex items-start gap-1.5 text-[0.78rem] font-semibold text-danger"
        >
          <Icon.alert className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[0.78rem] text-muted">{hint}</p>
      )}
    </div>
  );
}

function SubmitButton() {
  // 서버 액션이 진행되는 동안 중복 제출을 막는다
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? "접수 중…" : "견적 문의 보내기"}
    </Button>
  );
}

/* ── 폼 ───────────────────────────────────────────────── */

export function QuoteForm() {
  const [state, action] = useActionState<QuoteState, FormData>(
    submitQuote,
    initialQuoteState,
  );

  const v = state.values;
  const err = state.errors;
  const str = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : "");
  const arr = (k: string) => (Array.isArray(v[k]) ? (v[k] as string[]) : []);

  const invalid = (k: string) =>
    err[k]
      ? ({ "aria-invalid": true, "aria-describedby": `${k}-error` } as const)
      : {};

  if (state.status === "ok") {
    return (
      <div className="rounded-brand border border-line bg-white p-8 shadow-card sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-full bg-ok-bg text-ok">
          <Icon.check className="size-7" />
        </span>
        <h2 className="mt-5 text-[1.375rem] text-navy">접수되었습니다</h2>
        <p className="mt-3 text-[0.9375rem] leading-[1.8] text-ink-2">
          담당자가 확인 후 연락드리겠습니다.
          {state.id != null && (
            <>
              {" "}
              접수번호는{" "}
              <strong className="font-bold text-navy" data-numeric>
                #{state.id}
              </strong>
              입니다.
            </>
          )}
        </p>
        <p className="mt-5 text-sm text-muted">
          급하시면 전화가 가장 빠릅니다.{" "}
          <a href={site.telHref} className="font-bold text-brand" data-numeric>
            {site.tel}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className="rounded-brand border border-line bg-white p-6 shadow-card sm:p-9"
    >
      {err.form && (
        <Alert tone="danger" className="mb-6">
          {err.form}
        </Alert>
      )}
      {Object.keys(err).length > 0 && !err.form && (
        <Alert tone="danger" className="mb-6">
          입력하지 않은 항목이 있습니다. 표시된 칸을 확인해 주세요.
        </Alert>
      )}

      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="company" label="업체명" required error={err.company}>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue={str("company")}
              placeholder="예) 보문관광호텔"
              className={`${inputClass} ${err.company ? errorClass : ""}`}
              {...invalid("company")}
            />
          </Field>

          <Field name="industry" label="업종" required error={err.industry}>
            <select
              id="industry"
              name="industry"
              defaultValue={str("industry")}
              className={`${inputClass} ${err.industry ? errorClass : ""}`}
              {...invalid("industry")}
            >
              <option value="">선택해 주세요</option>
              {inquiryIndustryOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="contactName" label="담당자" required error={err.contactName}>
            <input
              id="contactName"
              name="contactName"
              type="text"
              autoComplete="name"
              defaultValue={str("contactName")}
              placeholder="예) 김지성"
              className={`${inputClass} ${err.contactName ? errorClass : ""}`}
              {...invalid("contactName")}
            />
          </Field>

          <Field name="phone" label="연락처" required error={err.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={str("phone")}
              placeholder="010-0000-0000"
              className={`${inputClass} ${err.phone ? errorClass : ""}`}
              data-numeric
              {...invalid("phone")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="region"
            label="사업장 지역"
            required
            hint="수거·배송 가능 여부를 지역 기준으로 확인합니다."
            error={err.region}
          >
            <input
              id="region"
              name="region"
              type="text"
              defaultValue={str("region")}
              placeholder="예) 경주시 보문로"
              className={`${inputClass} ${err.region ? errorClass : ""}`}
              {...invalid("region")}
            />
          </Field>

          <Field
            name="email"
            label="이메일"
            hint="견적서를 메일로 받으실 경우 적어주세요."
            error={err.email}
          >
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={str("email")}
              placeholder="manager@example.com"
              className={`${inputClass} ${err.email ? errorClass : ""}`}
              {...invalid("email")}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-[0.8125rem] font-bold text-ink">세탁 품목</legend>
          <div className="flex flex-wrap gap-2">
            {inquiryItemOptions.map((item) => (
              <label
                key={item}
                className="inline-flex cursor-pointer items-center gap-2 rounded-brand border-[1.5px] border-line-strong px-3.5 py-2.5 text-sm font-semibold text-ink-2 transition-colors duration-150 hover:border-sky has-checked:border-brand has-checked:bg-tint has-checked:text-navy"
              >
                <input
                  type="checkbox"
                  name="items"
                  value={item}
                  defaultChecked={arr("items").includes(item)}
                  className="size-[0.9375rem] accent-brand"
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="volume"
            label="주당 예상 물량"
            hint="대략만 적어주셔도 상담이 가능합니다."
            error={err.volume}
          >
            <input
              id="volume"
              name="volume"
              type="text"
              defaultValue={str("volume")}
              placeholder="예) 시트 200장 · 타월 300장"
              className={`${inputClass} ${err.volume ? errorClass : ""}`}
              {...invalid("volume")}
            />
          </Field>

          <Field name="cycle" label="희망 수거 주기" error={err.cycle}>
            <select
              id="cycle"
              name="cycle"
              defaultValue={str("cycle")}
              className={`${inputClass} ${err.cycle ? errorClass : ""}`}
              {...invalid("cycle")}
            >
              <option value="">선택해 주세요</option>
              {inquiryCycleOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field name="message" label="문의 내용" error={err.message}>
          <textarea
            id="message"
            name="message"
            rows={4}
            defaultValue={str("message")}
            placeholder="현재 이용 중인 방식이나 불편한 점을 적어주시면 상담에 도움이 됩니다."
            className={`${inputClass} min-h-26 resize-y leading-[1.7] ${err.message ? errorClass : ""}`}
            {...invalid("message")}
          />
        </Field>

        <div>
          <label
            htmlFor="consent"
            className="flex cursor-pointer items-start gap-2.5 rounded-brand border border-line bg-paper px-4 py-3.5"
          >
            <input
              id="consent"
              name="consent"
              type="checkbox"
              defaultChecked={str("consent") === "on"}
              className="mt-1 size-4 shrink-0 accent-brand"
              {...invalid("consent")}
            />
            <span className="text-[0.8125rem] leading-[1.7] text-ink-2">
              <strong className="font-bold text-ink">
                개인정보 수집 · 이용에 동의합니다.
              </strong>
              <span className="text-danger" aria-hidden="true">
                {" "}
                *
              </span>
              <br />
              수집 항목 : 업체명 · 담당자명 · 연락처 · 사업장 지역 · 이메일
              &nbsp;/&nbsp; 목적 : 견적 상담 및 회신 &nbsp;/&nbsp; 보유 기간 : 상담
              종료 후 1년
            </span>
          </label>
          {err.consent && (
            <p
              id="consent-error"
              className="mt-1.5 flex items-start gap-1.5 text-[0.78rem] font-semibold text-danger"
            >
              <Icon.alert className="mt-px size-3.5 shrink-0" />
              {err.consent}
            </p>
          )}
        </div>

        <SubmitButton />
      </div>
    </form>
  );
}
