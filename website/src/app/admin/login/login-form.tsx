"use client";

import { useActionState } from "react";
import { adminLoginAction } from "./actions";
import { Button } from "@/components/ui";

const inputClass =
  "w-full rounded-brand border-[1.5px] border-line-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors duration-150 placeholder:text-faint hover:border-sky focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/18";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(adminLoginAction, {
    error: null,
  });

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5 text-[0.8125rem] font-bold text-ink">
        아이디
        <input
          name="user"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[0.8125rem] font-bold text-ink">
        비밀번호
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>
      {state.error && (
        <p className="text-[0.8125rem] font-semibold text-danger">{state.error}</p>
      )}
      <Button type="submit" block disabled={pending}>
        {pending ? "확인 중…" : "로그인"}
      </Button>
    </form>
  );
}
