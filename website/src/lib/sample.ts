/**
 * 샘플(더미) 내용 스위치.
 *
 * 확정되지 않은 사업 정보를 화면에 채워 넣어 완성된 모습으로 보여주기 위한 장치다.
 * 대표·팀장 검토용 시연에는 빈칸보다 채워진 화면이 낫지만,
 * **가짜 값이 그대로 운영에 올라가는 것**은 막아야 한다. 그래서
 *
 *   1) 더미 값은 전부 이 파일 한 곳에만 둔다 (찾아서 지우기 쉽게)
 *   2) 켜져 있으면 화면 맨 위에 눈에 띄는 배너가 항상 뜬다 (몰래 배포될 수 없게)
 *   3) 숫자는 그럴싸하게 만들지 않고 0으로 채운다 (실제 번호로 오인될 수 없게)
 *
 * 실제 값이 확정되면 이 파일의 값을 채우고 `.env` 에
 *   NEXT_PUBLIC_SAMPLE_CONTENT=off
 * 를 넣으면 배너가 사라진다.
 */
export const SAMPLE_CONTENT = process.env.NEXT_PUBLIC_SAMPLE_CONTENT !== "off";

/**
 * 사업자 정보.
 *
 * ⚠️ 번호는 전부 0 이다. 실제로 존재할 수 있는 형태의 가짜 번호를 쓰지 않았다 —
 *    사업자등록번호나 인증번호를 그럴싸하게 지어내면 그게 진짜인 줄 알고 쓰인다.
 *
 * 확정 필요: 지성크리닝이 (주)지성이엔지의 사업부인지 별도 사업자인지에 따라
 * 아래 값이 모회사 것과 같아질 수도, 달라질 수도 있다.
 */
export const businessInfo = {
  /** 사업자등록번호 — 확정 필요 */
  registrationNumber: SAMPLE_CONTENT ? "000-00-00000" : null,
  /** 대표자 — 확정 필요. 사람 이름을 지어내지 않는다 */
  representative: SAMPLE_CONTENT ? "확인 필요" : null,
  /** 통신판매업 신고번호 — 온라인 판매를 하지 않으면 해당 없음일 수 있다 */
  mailOrderNumber: SAMPLE_CONTENT ? "제0000-경주-0000호" : null,
  /** 팩스 — 확정 필요 */
  fax: SAMPLE_CONTENT ? "054-000-0000" : null,
} as const;

/**
 * 운영 시간 — 확정 필요.
 * 일반적인 세탁공장 운영 시간을 넣어 뒀을 뿐 실제 값이 아니다.
 */
export const businessHours = SAMPLE_CONTENT
  ? {
      weekday: "평일 08:00 – 18:00",
      saturday: "토요일 08:00 – 13:00",
      holiday: "일요일 · 공휴일 휴무",
    }
  : null;

/**
 * 장애인 표준사업장 인증 — 확정 필요.
 * 인증기관은 실제로 한국장애인고용공단이 맞으나, 번호와 일자는 확인 전이다.
 */
export const certification = SAMPLE_CONTENT
  ? {
      issuer: "고용노동부 · 한국장애인고용공단",
      number: "제0000호",
      date: "0000. 00. 00.",
    }
  : null;

/**
 * 세탁 능력 — 확정 필요.
 * 설비 사양을 확인하기 전이라 실측값이 아니다.
 */
export const capacity = SAMPLE_CONTENT
  ? [
      { label: "일일 세탁 물량", value: "0,000", unit: "장" },
      { label: "전문 세탁 설비", value: "0", unit: "대" },
      { label: "수거 · 배달(납품) 차량", value: "0", unit: "대" },
      { label: "세탁 소요", value: "0", unit: "일" },
    ]
  : null;

/**
 * 서비스 권역 — 확정 필요.
 * 경주 인근이라는 사실만 확인됐고 정확한 범위는 미정이다.
 */
export const serviceAreas = SAMPLE_CONTENT
  ? {
      primary: ["경주시"],
      secondary: ["포항시", "울산 북구", "영천시"],
    }
  : null;
