"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminSessionToken,
} from "@/lib/admin-session";

/** 로그인 — 성공 시 30일 쿠키를 심고 원래 가려던 관리자 화면으로 보낸다 */
export async function adminLoginAction(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password) {
    return { error: "관리자 계정이 설정되지 않았습니다." };
  }

  const givenUser = String(formData.get("user") ?? "");
  const givenPass = String(formData.get("password") ?? "");
  if (givenUser !== user || givenPass !== password) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const token = await adminSessionToken();
  if (!token) return { error: "세션을 만들 수 없습니다." };

  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

/** 로그아웃 — 쿠키만 지운다 (심을 때와 같은 path 여야 삭제가 먹는다) */
export async function adminLogoutAction() {
  (await cookies()).delete({ name: ADMIN_SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
