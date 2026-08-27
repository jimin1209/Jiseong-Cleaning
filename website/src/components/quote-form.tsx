"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { T, useCopy } from "./copy-text";
import { Icon } from "./icons";
import { Alert, Button } from "./ui";
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
  /* 문구 데이터화(copy.ts)로 <T> 요소도 받는다 — 렌더 결과는 동일 */
  label: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
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
      {pending ? <T k="quoteForm.pending" /> : <T k="quoteForm.submit" />}
    </Button>
  );
}

/* ── 폼 ───────────────────────────────────────────────── */

export function QuoteForm() {
  const [state, action] = useActionState<QuoteState, FormData>(
    submitQuote,
    initialQuoteState,
  );
  // placeholder 는 속성 문자열이라 <T> 대신 get() 으로 읽는다
  const { get } = useCopy();

  const v = state.values;
  const err = state.errors;
  const str = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : "");

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
        <h2 className="mt-5 text-[1.375rem] text-navy"><T k="quoteForm.success.title" /></h2>
        <p className="mt-3 text-[0.9375rem] leading-[1.8] text-ink-2">
          <T k="quoteForm.success.body" />
          {state.id != null && (
            <>
              {" "}
              <T k="quoteForm.success.idPre" />{" "}
              <strong className="font-bold text-navy" data-numeric>
                #{state.id}
              </strong>
              <T k="quoteForm.success.idPost" />
            </>
          )}
        </p>
        <p className="mt-5 text-sm text-muted">
          <T k="quoteForm.success.callNote" />{" "}
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
          <T k="quoteForm.errorSummary" />
        </Alert>
      )}

      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="company" label={<T k="quoteForm.company.label" />} required error={err.company}>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue={str("company")}
              placeholder={get("quoteForm.company.placeholder")}
              className={`${inputClass} ${err.company ? errorClass : ""}`}
              {...invalid("company")}
            />
          </Field>

          <Field name="contactName" label={<T k="quoteForm.contactName.label" />} required error={err.contactName}>
            <input
              id="contactName"
              name="contactName"
              type="text"
              autoComplete="name"
              defaultValue={str("contactName")}
              placeholder={get("quoteForm.contactName.placeholder")}
              className={`${inputClass} ${err.contactName ? errorClass : ""}`}
              {...invalid("contactName")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="phone" label={<T k="quoteForm.phone.label" />} required error={err.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={str("phone")}
              placeholder={get("quoteForm.phone.placeholder")}
              className={`${inputClass} ${err.phone ? errorClass : ""}`}
              data-numeric
              {...invalid("phone")}
            />
          </Field>

          <Field
            name="email"
            label={<T k="quoteForm.email.label" />}
            hint={<T k="quoteForm.email.hint" />}
            error={err.email}
          >
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={str("email")}
              placeholder={get("quoteForm.email.placeholder")}
              className={`${inputClass} ${err.email ? errorClass : ""}`}
              {...invalid("email")}
            />
          </Field>
        </div>

        <Field
          name="region"
          label={<T k="quoteForm.region.label" />}
          required
          hint={<T k="quoteForm.region.hint" />}
          error={err.region}
        >
          <input
            id="region"
            name="region"
            type="text"
            defaultValue={str("region")}
            placeholder={get("quoteForm.region.placeholder")}
            className={`${inputClass} ${err.region ? errorClass : ""}`}
            {...invalid("region")}
          />
        </Field>

        <Field name="message" label={<T k="quoteForm.message.label" />} error={err.message}>
          <textarea
            id="message"
            name="message"
            rows={4}
            defaultValue={str("message")}
            placeholder={get("quoteForm.message.placeholder")}
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
                <T k="quoteForm.consent.title" />
              </strong>
              <span className="text-danger" aria-hidden="true">
                {" "}
                *
              </span>
              <br />
              <T k="quoteForm.consent.detail" />
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
