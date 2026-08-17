/**
 * 사업 정보 단일 출처.
 * 화면에 상호·전화·주소를 직접 쓰지 말고 여기서 가져다 쓴다.
 *
 * `확정 필요` 주석이 붙은 값은 아직 확인되지 않은 항목이다.
 * Document/브랜드-웹디자인-규격서 의 「확정 필요」 목록과 짝을 이룬다.
 */

export const site = {
  name: "지성크리닝",
  /** 영문 표기 — 락업 반전형과 OG 이미지에 쓴다 */
  nameEn: "JISEONG CLEANING",
  /** 모회사 */
  parent: "(주)지성이엔지",
  parentUrl: "http://jiseong.co.kr/", // www 를 붙이면 도메인 파킹 스텁으로 간다(2026-08-14 실측)

  tagline: "사업장 린넨을 수거부터 배달까지 대신 관리합니다",
  description:
    "경주 천북면 자체 세탁 시설을 갖춘 장애인 표준사업장. 호텔·모텔·펜션 린넨과 식당·급식소 행주를 정해진 주기로 수거·세탁·납품합니다.",

  tel: "054-621-5002",
  /** tel: 링크용 — 하이픈 제거 */
  telHref: "tel:+82546215002",

  address: "경상북도 경주시 천북면 모서안길 44",
  addressShort: "경주시 천북면 모서안길 44",
  region: "경상북도 경주시",

  /** 운영시간 — 확정 필요 */
  hours: null as string | null,

  /** 배포 도메인 확정 후 교체 — 사이트맵·OG·구조화 데이터가 이 값을 쓴다 */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jiseongcleaning.co.kr",
} as const;

/** 상단·하단 공통 내비게이션 */
export const nav = [
  { href: "/services", label: "서비스" },
  { href: "/facility", label: "시설 · 공정" },
  { href: "/about", label: "회사소개" },
  { href: "/quote", label: "견적 문의" },
] as const;

/** 히어로와 회사소개에서 쓰는 신뢰 근거 */
export const trustPoints = [
  "장애인 표준사업장",
  "월 단위 정기 계약 가능",
  "경주 천북면 자체 세탁 시설",
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
  { label: "단체시설", icon: "group" },
] as const;

export type IndustryIcon = (typeof targetIndustries)[number]["icon"];
