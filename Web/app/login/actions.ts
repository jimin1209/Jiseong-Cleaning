"use server";

import { redirect } from "next/navigation";
import { createDemoSession } from "@/lib/auth/session";

export type LoginState = {
  error?: string;
};

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = String(formData.get("phone") ?? "").trim();

  if (!phone) {
    return { error: "테스트에 사용할 휴대폰 번호를 입력해 주세요." };
  }

  const session = await createDemoSession(phone);
  redirect(session.role === "ADMIN" ? "/admin/orders" : "/dashboard");
}
