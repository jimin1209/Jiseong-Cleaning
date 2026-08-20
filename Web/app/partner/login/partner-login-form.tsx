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
        <input autoFocus id="companyName" maxLength={100} name="companyName" placeholder="예: 지성호텔" required />
      </div>
      <div className="field">
        <label htmlFor="partnerCode">거래처 코드</label>
        <input
          autoComplete="current-password"
          id="partnerCode"
          maxLength={32}
          minLength={10}
          name="partnerCode"
          pattern="(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9-]{10,32}"
          placeholder="예: HOTEL-7F3K92"
          required
          type="password"
        />
      </div>
      {state.error ? <p className="error" aria-live="polite">{state.error}</p> : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "접속 중..." : "내 발주 보기"}
      </button>
    </form>
  );
}
