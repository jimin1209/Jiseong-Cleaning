import { NextResponse, type NextRequest } from "next/server";

/**
 * /admin 보호 — HTTP Basic 인증.
 *
 * 문의 목록에는 거래처 담당자의 연락처가 들어가므로 공개돼서는 안 된다.
 * 정식 관리자 인증(설계서 4.2 · 역할별 권한)은 발주 시스템 쪽에서 만들 예정이고,
 * 홍보 사이트의 문의 조회는 그때까지 이 한 겹으로 막는다.
 *
 * ADMIN_USER / ADMIN_PASSWORD 가 설정되지 않으면 접근을 전부 거부한다.
 * (기본 비밀번호를 두면 그게 그대로 운영에 올라간다)
 */
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse(
      "관리자 계정이 설정되지 않았습니다. .env 에 ADMIN_USER 와 ADMIN_PASSWORD 를 지정하세요.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

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

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="jiseongcleaning-admin", charset="UTF-8"',
      "content-type": "text/plain; charset=utf-8",
    },
  });
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
