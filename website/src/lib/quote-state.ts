/**
 * 견적 폼의 상태 타입.
 *
 * 서버 액션 파일("use server")에서는 async 함수만 내보낼 수 있어서
 * 타입과 초기값은 이 일반 모듈에 둔다. 서버·클라이언트 양쪽이 여기서 가져온다.
 */
export type QuoteState = {
  status: "idle" | "ok" | "error";
  /** 필드명 → 오류 메시지 */
  errors: Record<string, string>;
  /** 실패 시 입력값을 되살리기 위한 원본 */
  values: Record<string, string | string[]>;
  /** 접수 번호 — 성공 안내에 쓴다 */
  id?: number;
};

export const initialQuoteState: QuoteState = {
  status: "idle",
  errors: {},
  values: {},
};
