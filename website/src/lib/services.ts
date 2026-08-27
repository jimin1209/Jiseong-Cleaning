/**
 * 서비스 데이터 — 페이지·카드·폼 선택지가 모두 이 배열을 쓴다.
 *
 * ⚠️ 문구 작성 기준: 전단지에 인쇄된 내용은 쓸 수 있고, 결정사항.md 의 ⛔ 항목
 *    (정산 방식·최소 물량·수거배송비·서비스 지역·다지점·보상 기준)은 단정하지 않는다.
 *    명세서·설계서의 기능(검수 후 금액 확정, 단계별 이력)은 앞으로 만들 시스템의
 *    설계일 뿐 현재 운영 방식이 아니므로 여기에 약속으로 적지 않는다.
 *
 * 서비스는 한 건으로 통합됐다(숙박 중심 + 월세탁 흡수, 주방 폐지).
 * 취급 품목 목록(itemGroups)은 품목 페이지 폐기와 함께 없앴다.
 */

export type Service = {
  slug: string;
  /** 내비게이션·카드에 쓰는 짧은 이름 */
  short: string;
  /** 페이지 제목 */
  title: string;
  /** 카드 한 줄 요약 */
  summary: string;
  /** 페이지 리드 문단 */
  lede: string;
  icon: "linen" | "kitchen" | "contract";
  /** 이 서비스를 주로 쓰는 업종 — site.ts targetIndustries 와 맞춘다 */
  forWhom: string[];
  /** 이 서비스의 차별점. 형용사 대신 공정·조건으로 쓴다 */
  points: { title: string; body: string }[];
  priceNote: string;
};

export const services: Service[] = [
  {
    slug: "laundry",
    short: "사업장 세탁물 정기 세탁",
    /* 제목은 확정 문구가 없어 layout 타이틀 계열로 임시 — 회의 검토 대상 */
    title: "사업장 세탁물 수거 · 세탁 · 배송",
    summary: "안전한 세탁·살균을 거쳐 약속된 날짜에 수거, 배송해 드립니다.",
    lede: "수거부터 배송까지 사업장 세탁물을 대신 관리해 드립니다.",
    icon: "linen",
    forWhom: ["호텔", "모텔", "펜션", "사우나", "헬스장", "단체시설"],
    points: [
      {
        title: "정기 수거 · 배송",
        body: "약속한 날짜에 맞춰 정기적으로 수거하고 배송합니다. 주 1회부터 3회 이상까지 상담해 정합니다.",
      },
      {
        title: "세탁 · 살균",
        body: "전문 설비로 세탁과 살균을 거칩니다. 형광증백제·표백제 등 유해성분은 넣지 않습니다.",
      },
      {
        title: "월 단위 정기 계약",
        body: "계약 시 수거와 배송 날짜를 정해 그 주기로 운영합니다. 매번 따로 발주하실 필요가 없습니다.",
      },
    ],
    priceNote:
      "단가는 품목 · 물량 · 수거 주기에 따라 달라집니다. 물량을 알려주시면 견적을 드립니다.",
  },
];

/** 이용 절차 — 순서가 정보이므로 번호를 쓴다 */
export const processSteps = [
  {
    title: "상담",
    body: "사업장 품목·물량 상담",
  },
  {
    title: "수거",
    body: "약속된 날짜와 시간에 방문 수거",
  },
  {
    title: "세탁",
    body: "전문 설비로 세탁·살균·건조",
  },
  {
    title: "배송",
    body: "검수 후 배송",
  },
] as const;

/** 견적 폼 품목 선택지 — 폼(S3) 개편 전까지 유지. 최종 정리는 병합 후 */
export const inquiryItemOptions = [
  "시트 · 이불 커버",
  "베개 커버",
  "수건 · 타월",
  "목욕 가운",
  "행주 · 주방타월",
  "앞치마 · 조리복",
  "유니폼",
  "식탁보 · 냅킨",
  "기타",
] as const;

export const inquiryIndustryOptions = [
  "호텔",
  "모텔",
  "펜션",
  "숙박시설",
  "기업체",
  "급식소 · 식당",
  "헬스장",
  "단체시설",
  "기타",
] as const;

export const inquiryCycleOptions = [
  "주 1회",
  "주 2회",
  "주 3회 이상",
  "월 1~2회",
  "협의 필요",
] as const;
