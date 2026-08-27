/**
 * 브랜드 색 일러스트.
 *
 * 실사 사진이 준비되기 전 자리를 채운다. 사진처럼 보이는 스톡 이미지를 쓰지 않은 이유는
 * 이 사이트의 논거가 「실체 있는 업체」이기 때문이다 — 남의 공장 사진을 올리면
 * 그 논거를 스스로 무너뜨린다. 그림은 그림으로 보이는 편이 정직하다.
 *
 * 촬영이 끝나면 이 컴포넌트 자리를 next/image 로 바꾸면 된다.
 */
type Props = { className?: string; variant: IllustrationVariant };

export type IllustrationVariant =
  | "machines"
  | "linen"
  | "truck"
  | "inspect"
  | "press"
  | "shelf";

const NAVY = "#14306E";
const BRAND = "#176FC0";
const SKY = "#0084D8";
const PALE = "#A6D9FA";
const TINT = "#DEF1FD";
const CYAN = "#00AEEF";

export function Illustration({ variant, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label={LABELS[variant]}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill={TINT} />
      {SCENES[variant]}
    </svg>
  );
}

const LABELS: Record<IllustrationVariant, string> = {
  machines: "전문 세탁기와 건조기가 나란히 놓인 세탁 설비 라인 일러스트",
  linen: "품목별로 개어 쌓아 둔 세탁물 일러스트",
  truck: "수거와 배달(납품)에 쓰는 배송 차량 일러스트",
  inspect: "품목과 수량을 검수해 기록하는 모습 일러스트",
  press: "유니폼을 프레스로 마감하는 모습 일러스트",
  shelf: "배달(납품) 단위로 적재한 선반 일러스트",
};

/* 공통 바닥 */
const Floor = (
  <>
    <rect y="238" width="400" height="62" fill={PALE} opacity="0.5" />
    <line x1="0" y1="238" x2="400" y2="238" stroke={SKY} strokeWidth="2" opacity="0.35" />
  </>
);

/** 세탁기 한 대 */
function Washer({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="86" height="112" rx="6" fill="#fff" stroke={NAVY} strokeWidth="3" />
      <rect x="10" y="10" width="66" height="16" rx="3" fill={TINT} />
      <circle cx="66" cy="18" r="4" fill={CYAN} />
      <circle cx="43" cy="70" r="28" fill={TINT} stroke={NAVY} strokeWidth="3" />
      <circle cx="43" cy="70" r="18" fill={PALE} />
      <path d="M25 70a18 18 0 0 1 36 0" fill={SKY} opacity="0.55" />
    </g>
  );
}

const SCENES: Record<IllustrationVariant, React.ReactNode> = {
  /* 설비 라인 */
  machines: (
    <>
      {Floor}
      <rect x="0" y="60" width="400" height="12" fill={PALE} opacity="0.6" />
      {/* 세탁기 폭 86 + 간격 12 → 마지막이 viewBox(400) 안에서 끝나야 잘리지 않는다 */}
      <Washer x={18} y={126} />
      <Washer x={116} y={126} />
      <Washer x={214} y={126} />
      <Washer x={312} y={126} />
      {/* 배관 */}
      <path
        d="M20 44h360"
        stroke={BRAND}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="90" cy="44" r="7" fill={CYAN} />
      <circle cx="200" cy="44" r="7" fill={CYAN} opacity="0.7" />
      <circle cx="310" cy="44" r="7" fill={CYAN} opacity="0.45" />
    </>
  ),

  /* 개어 쌓은 세탁물 */
  linen: (
    <>
      {Floor}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${112 + i * 3} ${196 - i * 26})`}>
          <rect
            width="176"
            height="24"
            rx="5"
            fill="#fff"
            stroke={NAVY}
            strokeWidth="2.5"
          />
          <line
            x1="14"
            y1="12"
            x2="162"
            y2="12"
            stroke={i % 2 ? SKY : PALE}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}
      <rect
        x="96"
        y="196"
        width="208"
        height="42"
        rx="6"
        fill={BRAND}
        opacity="0.18"
      />
      {/* 김 */}
      <path
        d="M300 96c10-14 10-24 0-38M322 104c8-12 8-20 0-32"
        stroke={CYAN}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </>
  ),

  /* 배송 차량 */
  truck: (
    <>
      {Floor}
      <rect x="34" y="112" width="180" height="96" rx="7" fill="#fff" stroke={NAVY} strokeWidth="3" />
      <path
        d="M214 146h56l40 40v22h-96z"
        fill={TINT}
        stroke={NAVY}
        strokeWidth="3"
      />
      <rect x="228" y="156" width="34" height="26" rx="3" fill={PALE} />
      <circle cx="96" cy="216" r="22" fill={NAVY} />
      <circle cx="96" cy="216" r="9" fill={PALE} />
      <circle cx="272" cy="216" r="22" fill={NAVY} />
      <circle cx="272" cy="216" r="9" fill={PALE} />
      {/* 차량 측면 로고 자리 */}
      <rect x="62" y="140" width="124" height="42" rx="4" fill={TINT} />
      <line x1="76" y1="154" x2="172" y2="154" stroke={BRAND} strokeWidth="6" strokeLinecap="round" />
      <line x1="76" y1="168" x2="140" y2="168" stroke={SKY} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* 속도선 */}
      <path
        d="M8 130h30M8 150h20M8 170h26"
        stroke={SKY}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </>
  ),

  /* 검수 */
  inspect: (
    <>
      {Floor}
      {/* 클립보드 */}
      <rect x="128" y="52" width="144" height="176" rx="8" fill="#fff" stroke={NAVY} strokeWidth="3" />
      <rect x="172" y="40" width="56" height="20" rx="5" fill={NAVY} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(150 ${92 + i * 32})`}>
          <rect width="18" height="18" rx="4" fill={TINT} stroke={SKY} strokeWidth="2.5" />
          <path
            d="m4 9 4 4 7-8"
            stroke={BRAND}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="30" y1="9" x2={96 - i * 12} y2="9" stroke={PALE} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
      {/* 세탁물 더미 */}
      <rect x="28" y="182" width="76" height="20" rx="5" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
      <rect x="34" y="204" width="76" height="20" rx="5" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
      <rect x="296" y="182" width="76" height="20" rx="5" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
      <rect x="290" y="204" width="76" height="20" rx="5" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
    </>
  ),

  /* 프레스 마감 */
  press: (
    <>
      {Floor}
      {/* 다림판 */}
      <path d="M64 200h272l-18 24H82z" fill={NAVY} opacity="0.15" />
      <rect x="70" y="186" width="260" height="16" rx="8" fill="#fff" stroke={NAVY} strokeWidth="3" />
      <line x1="120" y1="202" x2="112" y2="238" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      <line x1="280" y1="202" x2="288" y2="238" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      {/* 셔츠 */}
      <path
        d="M150 130h100l14 22-20 12v22h-88v-22l-20-12z"
        fill="#fff"
        stroke={NAVY}
        strokeWidth="3"
      />
      <path d="M186 130l14 16 14-16" fill={TINT} stroke={NAVY} strokeWidth="2.5" />
      {/* 스팀 */}
      <path
        d="M124 96c10-14 10-26 0-40M200 84c10-14 10-26 0-40M276 96c10-14 10-26 0-40"
        stroke={CYAN}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </>
  ),

  /* 적재 선반 */
  shelf: (
    <>
      {Floor}
      {/* 기둥 */}
      <rect x="46" y="42" width="10" height="196" rx="4" fill={NAVY} />
      <rect x="344" y="42" width="10" height="196" rx="4" fill={NAVY} />
      {[0, 1, 2].map((row) => (
        <g key={row} transform={`translate(0 ${72 + row * 60})`}>
          <rect x="46" y="46" width="308" height="9" rx="4" fill={NAVY} opacity="0.85" />
          {[0, 1, 2, 3].map((col) => (
            <g key={col} transform={`translate(${72 + col * 72} 8)`}>
              <rect
                width="56"
                height="38"
                rx="5"
                fill="#fff"
                stroke={NAVY}
                strokeWidth="2.5"
              />
              <line
                x1="8"
                y1="13"
                x2="48"
                y2="13"
                stroke={col % 2 ? SKY : PALE}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="25"
                x2="36"
                y2="25"
                stroke={PALE}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      ))}
    </>
  ),
};

/**
 * 캡션이 붙은 일러스트 카드. PhotoSlot 을 대체한다.
 */
export function IllustrationCard({
  variant,
  title,
  caption,
}: {
  variant: IllustrationVariant;
  title: string;
  caption: string;
}) {
  return (
    <figure className="overflow-hidden rounded-brand border border-line bg-white shadow-card">
      <Illustration variant={variant} className="aspect-[4/3] w-full" />
      <figcaption className="border-t border-line px-4 py-3.5">
        <strong className="block text-[0.9375rem] font-bold text-navy">{title}</strong>
        <span className="mt-0.5 block text-[0.8125rem] text-muted">{caption}</span>
      </figcaption>
    </figure>
  );
}
