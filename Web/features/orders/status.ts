export const orderStatusSteps = [
  "신청접수",
  "주문확인",
  "수거중",
  "수거완료",
  "세탁중",
  "세탁완료",
  "납품완료",
] as const;

export function normalizeOrderStatus(status: string) {
  return status === "접수" ? "신청접수" : status;
}
