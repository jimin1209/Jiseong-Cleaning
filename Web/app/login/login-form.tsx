"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <div className="field">
        <label htmlFor="phone">휴대폰 번호</label>
        <input
          autoComplete="tel"
          autoFocus
          id="phone"
          name="phone"
          placeholder="010-1234-5678"
          type="tel"
        />
      </div>

      {state.error ? (
        <p aria-live="polite" className="error">
          {state.error}
        </p>
      ) : null}

      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "로그인 중..." : "테스트 로그인"}
      </button>
    </form>
  );
}
