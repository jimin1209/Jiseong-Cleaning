import type { NextConfig } from "next";

/**
 * 개발 서버를 localhost 가 아닌 주소(Tailscale·사내망·다른 기기)로 열 때
 * Next 16 은 /_next/static/* 요청을 기본 차단한다. 그러면 HTML 은 200 인데
 * 클라이언트 청크가 전부 403 이라 하이드레이션이 안 되고 화면이 이상해진다.
 *
 * 그래서 개발 중 접속할 호스트를 여기서 허용해 준다.
 * 다른 기기·다른 IP 로 열 일이 생기면 .env.local 에 추가하면 된다.
 *
 *   ALLOWED_DEV_ORIGINS=10.0.0.5,my-pc.local
 *
 * 운영 빌드에는 영향이 없다(개발 전용 설정).
 */
const extraDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  /**
   * 배포용 자립 출력.
   *
   * 이걸 켜면 .next/standalone 에 서버 실행에 필요한 것만 모인다
   * (node_modules 500MB · .next 300MB 를 통째로 올리지 않아도 된다).
   * public 과 .next/static 은 Next 가 자동으로 넣어주지 않으므로
   * scripts/pack.mjs 가 함께 복사해 배포 폴더를 완성한다.
   *
   * ⚠️ Netlify 에서는 켜지 않는다. Netlify 의 Next 런타임이 출력 형태를
   *    직접 관리하므로 여기서 지정하면 충돌한다. NETLIFY 는 Netlify 빌드에서
   *    자동으로 설정되는 환경변수다.
   */
  ...(process.env.NETLIFY ? {} : { output: "standalone" as const }),

  allowedDevOrigins: [
    "100.107.165.112", // 이 PC Tailscale
    "192.168.123.8", // 사내망
    "192.168.0.188",
    ...extraDevOrigins,
  ],
};

export default nextConfig;
