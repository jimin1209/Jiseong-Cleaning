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
 *
 * 이 파일이 관리하는 더미 목록 (실값 확정 시 교체)
 *   - businessInfo    사업자 정보 — 사업자등록증 수령 대기
 *   - businessHours   운영 시간
 *   - certification   표준사업장 인증 번호·일자
 *   - capacity        처리 능력 수치
 *   - serviceAreas    서비스 권역
 *   - smsBody         SMS 자동 작성 문구 — 문구 확정 대기(명세 G3)
 *   - reviews         후기 카드 — 회사 측 초안 대기(명세 G4)
 *   - slides 의 지성이엔지 자리 2장 — 원본 배너 이미지 수급 대기(명세 8-6)
 *   - snsLinks        인스타그램·네이버 블로그 — 계정 개설 대기(명세 9-6)
 */
import { site } from "./site";

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
 * 일반적인 세탁공장 운영시간을 넣어 뒀을 뿐 실제 값이 아니다.
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
 * 처리 능력 — 확정 필요.
 * 설비 사양을 확인하기 전이라 실측값이 아니다.
 */
export const capacity = SAMPLE_CONTENT
  ? [
      { label: "일 처리 물량", value: "0,000", unit: "장" },
      { label: "전문 세탁 설비", value: "0", unit: "대" },
      { label: "수거 · 배송 차량", value: "0", unit: "대" },
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

/**
 * SMS 자동 작성 문구 (명세 9-5) — 문구 확정 대기(G3).
 * 확정 전 더미. 꺼져 있으면 빈 문구로 문자 앱만 열린다.
 */
export const smsBody = SAMPLE_CONTENT
  ? "지성크리닝 문의드립니다. 업체명: / 품목: / 물량: "
  : "";

export type Review = {
  /** 익명 표기만 쓴다 — 실명·실업체를 지어내지 않는다 */
  name: string;
  /** 업종 — site.ts 의 적합 업종 안에서 고른다 */
  biz: string;
  quote: string;
};

/**
 * 후기 카드 (명세 4-3·9-1) — 회사 측 문구 초안 대기(G4).
 * 초안이 오면 이 배열만 교체하면 된다. 꺼져 있으면 후기 섹션이 통째로 빠진다.
 */
export const reviews: Review[] | null = SAMPLE_CONTENT
  ? [
      { name: "김○○님", biz: "펜션", quote: "친절한 상담이었어요" },
      { name: "이○○님", biz: "호텔", quote: "세탁물이 깨끗하게 와요" },
      { name: "박○○님", biz: "사우나", quote: "약속한 날짜에 꼭 맞춰 와 주세요" },
      { name: "최○○님", biz: "헬스장", quote: "수건 상태가 늘 한결같아요" },
      { name: "정○○님", biz: "모텔", quote: "수거와 배송이 빨라서 편해요" },
    ]
  : null;

export type Slide = {
  id: string;
  /** 이미지가 없는 동안 쓰는 단색 배경 톤 */
  tone: "navy" | "brand" | "tint";
  eyebrow?: string;
  title: string;
  body?: string;
  /** 원본 이미지를 받으면 경로를 넣는다 — 슬라이드 배경으로 깔린다 */
  image: string | null;
};

/**
 * 자동 슬라이드 배너 (명세 8-6).
 * 1·2번은 사이트의 확정 문구를 재사용한 것이라 더미가 아니고,
 * 지성이엔지 차용 콘텐츠 2장은 원본 이미지 수급 전이라 자리만 잡아 뒀다
 * (자리 슬라이드는 샘플 모드에서만 보인다).
 */
export const slides: Slide[] = [
  {
    id: "cleaning",
    tone: "navy",
    eyebrow: site.name,
    title: site.tagline,
    body: "약속한 날짜에 수거하고, 세탁·살균을 거쳐 배송합니다.",
    image: null,
  },
  {
    id: "standard-workplace",
    tone: "tint",
    eyebrow: "사회적 가치",
    title: "장애인 표준사업장으로 운영합니다",
    body: "지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다.",
    image: null,
  },
  ...(SAMPLE_CONTENT
    ? ([
        {
          id: "jiseong-eng-1",
          tone: "brand",
          eyebrow: site.parent,
          title: "지성이엔지 콘텐츠 자리 ①",
          body: "원본 배너 자료를 받은 뒤 이 자리에 넣습니다.",
          image: null,
        },
        {
          id: "jiseong-eng-2",
          tone: "brand",
          eyebrow: site.parent,
          title: "지성이엔지 콘텐츠 자리 ②",
          body: "원본 배너 자료를 받은 뒤 이 자리에 넣습니다.",
          image: null,
        },
      ] satisfies Slide[])
    : []),
];

/**
 * SNS 링크 (명세 9-6) — 계정 개설 전이라 전부 null.
 * 개설되면 주소를 넣는다. null 이면 버튼이 "준비 중" 안내를 띄운다.
 */
export const snsLinks: { instagram: string | null; naverBlog: string | null } = {
  instagram: null,
  naverBlog: null,
};
