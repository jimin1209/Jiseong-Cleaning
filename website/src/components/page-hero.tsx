import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { Container } from "./ui";

/**
 * 하위 페이지 머리.
 * 홈 히어로보다 얕게 — 각 페이지의 주역은 히어로가 아니라 내용이다.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  aside,
}: {
  /* 문구 데이터화(copy.ts)로 <T> 요소도 받는다 — 렌더 결과는 동일 */
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0E2450_0%,#14306E_58%,#1B4FA8_100%)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -top-[40%] aspect-square w-[min(34rem,64vw)] bg-[radial-gradient(circle_at_50%_50%,rgb(0_174_239/0.26)_0%,rgb(0_174_239/0)_62%)]"
      />
      <BrandMark
        tone="glow"
        className="pointer-events-none absolute -right-[22%] top-1/2 w-[min(24rem,70vw)] -translate-y-1/2 opacity-[0.10] sm:-right-[3%] sm:opacity-[0.13]"
      />

      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-8 py-12 sm:py-16 lg:py-20">
          {/* 진입은 CSS 애니메이션 — JS 실패와 무관하게 내용이 보인다 */}
          <div className="hero-enter max-w-[38rem]">
            <p className="mb-4 flex items-center gap-2.5 text-[0.78rem] font-bold tracking-[0.16em] text-pale">
              <span className="h-0.5 w-6 rounded-full bg-ci-cyan" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="text-[1.875rem] leading-[1.26] tracking-[-0.035em] sm:text-[2.25rem] lg:text-[2.5rem]">
              {title}
            </h1>
            {lede && <p className="mt-4 text-base leading-[1.85] text-[#C8DBF2]">{lede}</p>}
          </div>
          {aside && <div className="hero-enter shrink-0">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
