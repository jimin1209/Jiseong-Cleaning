/**
 * 관리자 세션 토큰 — 로그인 쿠키와 proxy 검증이 공유하는 단일 규칙.
 *
 * 별도 시크릿 없이 ADMIN_PASSWORD 를 HMAC 키로 쓴다: 비밀번호를 바꾸면
 * 모든 세션이 즉시 무효가 되는 것이 홍보 사이트 관리 용도에는 오히려 맞다.
 * Web Crypto 만 사용해 edge(proxy)와 node(서버 액션) 양쪽에서 동작한다.
 */

export const ADMIN_SESSION_COOKIE = "jc_admin_session";
/** 로그인 유지 기간 — 30일 */
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function adminSessionToken(): Promise<string | null> {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`jiseong-admin-session:${user}`),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
