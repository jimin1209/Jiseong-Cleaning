"use client";

import { useActionState } from "react";
import { partnerLogin, type PartnerLoginState } from "./actions";

const initialState: PartnerLoginState = {};

export function PartnerLoginForm() {
  const [state, formAction, pending] = useActionState(partnerLogin, initialState);
  return (
    <form action={formAction}>
      <div className="field">
        <label htmlFor="companyName">거래처명</label>
        <input autoFocus id="companyName" maxLength={100} name="companyName" placeholder="예: 지성호텔" />
      </div>
      {state.error ? <p className="error" aria-live="polite">{state.error}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "접속 중..." : "발주 화면으로"}
      </button>
    </form>
  );
}
