/**
 * 표준 단가표.
 *
 * ⚠️ 값의 출처는 `Document/품목-단가표.md` 이고, 그 문서 자체가
 *    「이 표의 단가는 예시 초안입니다 — 대표님이 실제 단가로 수정하세요」
 *    라고 명시하고 있다. 즉 **실제 단가가 아니다.**
 *
 *    그래서 화면에도 「예시 초안」임을 반드시 함께 표기한다(PriceTable 컴포넌트가 처리).
 *    실제 단가가 확정되면 이 파일의 숫자만 바꾸고 `isDraft` 를 false 로 내린다.
 *
 * 거래처별 계약 단가는 이 표준 단가와 별개로 관리자 화면에서 설정한다(명세서 4.9).
 */

export const isDraft = true;

export type PriceItem = { name: string; price: number | null; note?: string };
export type PriceGroup = { label: string; items: PriceItem[] };

/** 단위: 원 / 장. price 가 null 이면 협의 품목 */
export const priceGroups: PriceGroup[] = [
  {
    label: "침구류",
    items: [
      { name: "호텔 시트 (싱글)", price: 800 },
      { name: "호텔 시트 (더블 · 킹)", price: 1000 },
      { name: "이불 커버", price: 1200 },
      { name: "베개 커버", price: 500 },
      { name: "매트리스 패드", price: 1500 },
      { name: "이불 · 담요", price: 3000, note: "부피 · 중량 큼" },
    ],
  },
  {
    label: "수건류",
    items: [
      { name: "대형 수건 (바스타월)", price: 600 },
      { name: "중형 수건 (핸드타월)", price: 400 },
      { name: "스포츠 타월", price: 500 },
      { name: "발매트", price: 700 },
    ],
  },
  {
    label: "가운 · 유니폼",
    items: [
      { name: "목욕 가운", price: 1500 },
      { name: "조리복", price: 2000 },
      { name: "주방 유니폼 (상 · 하)", price: 2500 },
      { name: "홀 유니폼", price: 1800 },
      { name: "앞치마", price: 900 },
    ],
  },
  {
    label: "주방 · 테이블 리넨",
    items: [
      { name: "식탁보 (대)", price: 1500 },
      { name: "식탁보 (소)", price: 800 },
      { name: "행주 · 주방타월", price: 300 },
      { name: "냅킨 (천)", price: 200 },
    ],
  },
  {
    label: "기타 · 특수",
    items: [
      { name: "커튼", price: null, note: "크기 · 소재별" },
      { name: "카펫 · 러그", price: null, note: "면적 기준" },
      { name: "고가 · 특수 품목", price: null, note: "접수 기준 별도" },
    ],
  },
];

/** 옵션 단가 */
export const priceOptions: { name: string; extra: string; note: string }[] = [
  { name: "살균 · 방역 세탁", extra: "+10%", note: "위생 강화" },
  { name: "개별 포장", extra: "+100원 / 장", note: "낱개 비닐 포장" },
  { name: "급행 (당일 · 익일)", extra: "+20%", note: "일정 우선 처리" },
  { name: "다림질 (유니폼)", extra: "+300원 / 장", note: "프레스 마감" },
];

/** 최소 발주 · 물류 조건 */
export const priceTerms: { label: string; value: string; note?: string }[] = [
  {
    label: "최소 발주 금액",
    value: "30,000원",
    note: "미만은 수거 · 납품비 부과 또는 접수 제한",
  },
  {
    label: "수거 · 납품비",
    value: "정기 거래처 무료",
    note: "단발 소량은 3,000 ~ 5,000원 · 지역 · 물량별 협의",
  },
  {
    label: "대량 거래처 할인",
    value: "거래처별 계약 단가로 반영",
  },
  {
    label: "과세",
    value: "VAT 별도",
    note: "실제 과세 방식은 정산 조건에서 확정",
  },
];

/** 어떤 서비스 페이지에 어느 분류를 보여줄지 */
export const priceGroupsByService: Record<string, string[]> = {
  linen: ["침구류", "수건류", "가운 · 유니폼"],
  kitchen: ["주방 · 테이블 리넨", "가운 · 유니폼"],
  contract: ["침구류", "수건류", "주방 · 테이블 리넨"],
};
