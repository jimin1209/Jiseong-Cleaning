/**
 * 아이콘 세트.
 * 규칙: stroke 2px 계열 · 라운드 캡 · 단색 · 24px 그리드.
 * 채움형 아이콘과 혼용하지 않는다(전단지의 채움형 아이콘을 그대로 쓰지 말 것).
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  phone: (p: P) => (
    <Base {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </Base>
  ),
  check: (p: P) => (
    <Base strokeWidth={2.4} {...p}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  ),
  arrowRight: (p: P) => (
    <Base strokeWidth={2.2} {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </Base>
  ),
  chevronRight: (p: P) => (
    <Base strokeWidth={2.2} {...p}>
      <path d="m9 18 6-6-6-6" />
    </Base>
  ),
  chevronLeft: (p: P) => (
    <Base strokeWidth={2.2} {...p}>
      <path d="m15 18-6-6 6-6" />
    </Base>
  ),
  menu: (p: P) => (
    <Base strokeWidth={2} {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </Base>
  ),
  close: (p: P) => (
    <Base strokeWidth={2} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Base>
  ),
  pin: (p: P) => (
    <Base {...p}>
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.8" />
    </Base>
  ),

  /* 서비스 */
  linen: (p: P) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="13.5" r="4" />
      <path d="M7 7h.01M11 7h.01" />
    </Base>
  ),
  kitchen: (p: P) => (
    <Base {...p}>
      <path d="M5 3v8a3 3 0 0 0 6 0V3" />
      <path d="M8 11v10" />
      <path d="M17 3c-1.5 2-2 4-2 6.5V13h4V9.5C19 7 18.5 5 17 3Z" />
      <path d="M17 13v8" />
    </Base>
  ),
  contract: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      <path d="M8 14h2M14 14h2M8 17.5h2" />
    </Base>
  ),

  /* 강점 */
  clock: (p: P) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.9" />
    </Base>
  ),
  shield: (p: P) => (
    <Base {...p}>
      <path d="M12 2.8 20 6v6c0 4.4-3.2 8-8 9.2C8 20 4.8 16.4 4.8 12V6Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </Base>
  ),
  doc: (p: P) => (
    <Base {...p}>
      <path d="M14 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.8Z" />
      <path d="M14 2.8v5h5" />
      <path d="m8.6 13.4 1.6 1.6 3.4-3.4" />
    </Base>
  ),
  truck: (p: P) => (
    <Base {...p}>
      <path d="M3 8h11v9H3z" />
      <path d="M14 11h4l3 3v3h-7z" />
      <circle cx="7" cy="19" r="1.8" />
      <circle cx="17.5" cy="19" r="1.8" />
    </Base>
  ),
  coin: (p: P) => (
    <Base {...p}>
      <ellipse cx="12" cy="6.5" rx="7.5" ry="3.2" />
      <path d="M4.5 6.5v5c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-5" />
      <path d="M4.5 11.5v5c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-5" />
    </Base>
  ),
  building: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M7.5 13.5h4M7.5 16.5h9" />
    </Base>
  ),
  /** 인증 도장 — 자격 표시. 사람 픽토그램을 쓰지 않는다(동정 소구가 되므로) */
  seal: (p: P) => (
    <Base {...p}>
      <circle cx="12" cy="8.6" r="5.8" />
      <path d="m8.6 13.8-1.3 7.4 4.7-2.6 4.7 2.6-1.3-7.4" />
      <path d="m9.7 8.6 1.7 1.7 3-3" />
    </Base>
  ),
  camera: (p: P) => (
    <Base strokeWidth={1.6} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M17 8.5h.01" />
    </Base>
  ),
  alert: (p: P) => (
    <Base strokeWidth={2.2} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16h.01" />
    </Base>
  ),

  /* 업종 */
  hotel: (p: P) => (
    <Base {...p}>
      <path d="M4 21V4h16v17" />
      <path d="M2 21h20" />
      <path d="M8 8h2M14 8h2M8 12h2M14 12h2M10.5 21v-4h3v4" />
    </Base>
  ),
  motel: (p: P) => (
    <Base {...p}>
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 18h18M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M8 10V8h3v2M13 10V8h3v2" />
    </Base>
  ),
  pension: (p: P) => (
    <Base {...p}>
      <path d="m3 10.5 9-7 9 7" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
    </Base>
  ),
  office: (p: P) => (
    <Base {...p}>
      <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M14 9h4a2 2 0 0 1 2 2v10" />
      <path d="M2 21h20M7.5 7h2M7.5 11h2M7.5 15h2" />
    </Base>
  ),
  group: (p: P) => (
    <Base {...p}>
      <circle cx="9" cy="7.5" r="3.1" />
      <path d="M2.8 20.2c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6" />
      <circle cx="18" cy="9" r="2.3" />
      <path d="M17 14.8c2.7-.3 4.9 1.6 4.9 4.6" />
    </Base>
  ),

  /* 문의 채널 · SNS */
  chat: (p: P) => (
    <Base {...p}>
      <path d="M21 11.6a8.4 8.4 0 0 1-8.5 8.3c-1.5 0-3-.4-4.2-1.1L3 20l1.3-5A8.4 8.4 0 1 1 21 11.6Z" />
    </Base>
  ),
  sms: (p: P) => (
    <Base {...p}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M8 8.5h8M8 12h5" />
    </Base>
  ),
  bot: (p: P) => (
    <Base {...p}>
      <rect x="4.5" y="8" width="15" height="11" rx="2" />
      <path d="M12 8V4.5M12 4.5h.01" />
      <path d="M9.3 12.8v1.4M14.7 12.8v1.4" />
      <path d="M9.5 16.5h5" />
    </Base>
  ),
  instagram: (p: P) => (
    <Base {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M17.2 6.8h.01" />
    </Base>
  ),
  /** 네이버 블로그 — 정식 브랜드 로고 확정 전 임시 글쓰기 픽토그램 */
  blog: (p: P) => (
    <Base {...p}>
      <path d="M12 4.5H6a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-2v-6" />
      <path d="M18.3 3.7a2 2 0 0 1 2.8 2.8l-7.6 7.6-3.6.8.8-3.6Z" />
    </Base>
  ),
} as const;

export type IconName = keyof typeof Icon;
