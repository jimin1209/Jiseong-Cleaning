/**
 * 사업 정보 단일 출처.
 * 화면에 상호·전화·주소를 직접 쓰지 말고 여기서 가져다 쓴다.
 *
 * `확정 필요` 주석이 붙은 값은 아직 확인되지 않은 항목이다.
 * Document/브랜드-웹디자인-규격서 의 「확정 필요」 목록과 짝을 이룬다.
 */

/** 운영 도메인. 가비아 등록, www 를 기본으로 쓴다 */
const PRODUCTION_URL = "https://www.jiseong-cleaning.co.kr";

/**
 * 사이트 주소를 정한다.
 *
 * ⚠️ `process.env.X ?? 기본값` 으로 쓰면 안 된다. `??` 는 null/undefined 만
 *    걸러내므로, Netlify UI 에서 **변수만 만들고 값을 비워두면** 빈 문자열이
 *    들어와 기본값이 적용되지 않는다. 그 값이 metadataBase 의 new URL() 에
 *    닿으면 빌드가 통째로 실패한다(ERR_INVALID_URL). 실제로 그렇게 깨졌다.
 *
 * 그래서 값이 있어도 **URL 로 파싱되는지 확인**하고, 안 되면 다음 후보로 넘어간다.
 *
 * 순서
 *   1. NEXT_PUBLIC_SITE_URL   — 직접 지정한 값이 최우선
 *   2. URL / DEPLOY_PRIME_URL — Netlify 가 배포마다 자동으로 넣어주는 주소.
 *                               덕분에 도메인 연결 전에도 사이트맵·OG 가 맞는다
 *   3. PRODUCTION_URL         — 최후 기본값
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Netlify 자동 주입값 (NEXT_PUBLIC_ 이 아니므로 서버에서만 보인다)
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    PRODUCTION_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;
      // 뒤 슬래시를 떼어 sitemap 등에서 `//` 가 생기지 않게 한다
      return parsed.origin;
    } catch {
      // 파싱 실패 — 다음 후보로
    }
  }

  return PRODUCTION_URL;
}

export const site = {
  name: "지성크리닝",
  /** 영문 표기 — 락업 반전형과 OG 이미지에 쓴다 */
  nameEn: "JISEONG CLEANING",
  /** 모회사 */
  parent: "(주)지성이엔지",
  parentUrl: "http://jiseong.co.kr/", // www 를 붙이면 도메인 파킹 스텁으로 간다(2026-08-14 실측)

  tagline: "사업장 세탁물을 수거부터 배달까지 대신 관리합니다",
  description:
    "경주 강동면 자체 세탁 시설을 갖춘 장애인 표준사업장. 기업·호텔·모텔·펜션·사우나 세탁물과 식당·급식소 행주를 정해진 날짜에 수거·세탁·배달(납품)합니다.",

  tel: "010-9828-3637",
  /** tel: 링크용 — 하이픈 제거 */
  telHref: "tel:+821098283637",

  address: "경상북도 경주시 강동면 모서안길 44 지성크리닝",
  addressShort: "경주시 강동면 모서안길 44",
  region: "경상북도 경주시",

  /** 모회사 본사 주소 — jiseong.co.kr 푸터에서 확인한 실제 값(2026-08-17) */
  parentAddress: "경상북도 경주시 용강동 승삼신리길 80",

  /** 지도 앱 길찾기 — API 키가 필요 없는 검색 링크 */
  mapLinks: {
    naver: "https://map.naver.com/p/search/경주시%20강동면%20모서안길%2044",
    kakao: "https://map.kakao.com/?q=경주시%20강동면%20모서안길%2044",
  },

  /** 사이트 주소 — 사이트맵·OG·구조화 데이터가 쓴다. 아래 resolveSiteUrl() 참고 */
  url: resolveSiteUrl(),
} as const;

/** 상단·하단 공통 내비게이션 */
export const nav = [
  { href: "/", label: "사업 개요" },
  { href: "/about", label: "회사 소개" },
  { href: "/services", label: "세탁 서비스" },
  { href: "/quote", label: "견적 문의" },
] as const;

/** 히어로와 회사 소개에서 쓰는 신뢰 근거 */
export const trustPoints = [
  "장애인 표준사업장",
  "정기 계약 가능",
  "경주 강동면 자체 세탁 시설",
] as const;

/**
 * 적합 업종.
 * 가정(아파트·빌라) 고객은 이 사이트 범위가 아니다 — 사업장 전용.
 */
export const targetIndustries = [
  { label: "호텔", icon: "hotel" },
  { label: "모텔", icon: "motel" },
  { label: "펜션", icon: "pension" },
  { label: "기업체", icon: "office" },
  { label: "급식소 · 식당", icon: "kitchen" },
  { label: "단체 시설", icon: "group" },
] as const;

export type IndustryIcon = (typeof targetIndustries)[number]["icon"];
