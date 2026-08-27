import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, adminSessionToken } from "@/lib/admin-session";

/**
 * /admin 보호 — 로그인 쿠키(기본) + HTTP Basic(호환).
 *
 * 문의 목록에는 거래처 담당자의 연락처가 들어가므로 공개돼서는 안 된다.
 * 브라우저 팝업(Basic)은 매번 입력이 번거로워 /admin/login 페이지에서
 * 30일 쿠키를 발급한다. 곧바로 URL 로 들어오는 curl·기존 북마크를 위해
 * Basic 헤더도 계속 받아준다.
 *
 * ADMIN_USER / ADMIN_PASSWORD 가 설정되지 않으면 접근을 전부 거부한다.
 * (기본 비밀번호를 두면 그게 그대로 운영에 올라간다)
 */
export async function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse(
      "관리자 계정이 설정되지 않았습니다. .env 에 ADMIN_USER 와 ADMIN_PASSWORD 를 지정하세요.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const { pathname } = request.nextUrl;

  // 로그인 화면과 그 서버 액션은 인증 없이 열려야 한다
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 1) 로그인 쿠키
  const token = await adminSessionToken();
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token && cookie && safeEqual(cookie, token)) {
    return NextResponse.next();
  }

  // 2) Basic 헤더 (curl·기존 사용 호환)
  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    // 비밀번호에 콜론이 들어갈 수 있으므로 첫 콜론만 기준으로 나눈다
    const idx = decoded.indexOf(":");
    const givenUser = idx >= 0 ? decoded.slice(0, idx) : "";
    const givenPass = idx >= 0 ? decoded.slice(idx + 1) : "";

    if (safeEqual(givenUser, user) && safeEqual(givenPass, password)) {
      return NextResponse.next();
    }
  }

  // 3) 둘 다 없으면 로그인 화면으로 (팝업 대신)
  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(login);
}

/** 길이가 달라도 조기 반환하지 않아 타이밍 차이를 줄인다 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export const config = {
  matcher: ["/admin/:path*"],
};
