import Link from "next/link";
import type { CSSProperties } from "react";
import { AutoSlider } from "@/components/auto-slider";
import { BrandMark } from "@/components/brand-mark";
import { T } from "@/components/copy-text";
import { ContactAction } from "@/components/contact-action";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { RotatingWords } from "@/components/rotating-words";
import { ScheduleCard } from "@/components/schedule-card";
import {
  Badge,
  ButtonLink,
  Card,
  Chip,
  Container,
  IconBubble,
  Section,
  SectionHead,
} from "@/components/ui";
import { processSteps, services } from "@/lib/services";
import { targetIndustries, trustPoints } from "@/lib/site";

/* ── 디자인 보강(D4·D5·D7) 데이터 — 문구는 병합 방안 표의 교체 목록 그대로 ── */

/** D5 로테이팅 키워드 — 문구는 copy.ts, 첫 키가 기본형(확정 문구·스크린리더용) */
const rotatingWordKeys = [
  "home.hero.rotating.0",
  "home.hero.rotating.1",
  "home.hero.rotating.2",
  "home.hero.rotating.3",
] as const;

/** D7 마퀴 배지 키워드 — 문구는 copy.ts */
const marqueeBadgeKeys = [
  "home.marquee.0",
  "home.marquee.1",
  "home.marquee.2",
  "home.marquee.3",
  "home.marquee.4",
  "home.marquee.5",
  "home.marquee.6",
] as const;

/** D4 히어로 거품 — 위치·크기·주기·투명도는 디자인 원본 그대로 */
const bubbles = [
  { left: "9%", size: 14, dur: "17s", delay: "-3s", alpha: [0.35, 0.06], pale: false },
  { left: "22%", size: 8, dur: "13s", delay: "-9s", alpha: [0.32, 0.05], pale: false },
  { left: "38%", size: 20, dur: "21s", delay: "-14s", alpha: [0.3, 0.04], pale: true },
  { left: "55%", size: 10, dur: "15s", delay: "-6s", alpha: [0.3, 0.05], pale: false },
  { left: "71%", size: 16, dur: "19s", delay: "-11s", alpha: [0.28, 0.04], pale: true },
  { left: "86%", size: 7, dur: "12s", delay: "-1s", alpha: [0.3, 0.05], pale: false },
] as const;

export default function HomePage() {
  return (
    <>
      {/* ═══════════════ 히어로 ═══════════════ */}
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0E2450_0%,#14306E_42%,#1B4FA8_100%)] text-white">
        {/* 시안 글로우 — 장식이므로 클릭을 막는다. 14초 주기로 부유한다(D3) */}
        <div
          aria-hidden="true"
          className="jc-glow pointer-events-none absolute -right-[8%] -top-[22%] aspect-square w-[min(46rem,72vw)] bg-[radial-gradient(circle_at_50%_50%,rgb(0_174_239/0.30)_0%,rgb(0_174_239/0)_62%)]"
        />
        {/* 심볼 워터마크 — 위치는 바깥 div, 회전(D2)은 안쪽에. transform 이 겹치면 위치가 무너진다 */}
        <div className="pointer-events-none absolute -right-[26%] top-1/2 w-[min(38rem,90vw)] -translate-y-1/2 sm:-right-[6%]">
          <BrandMark tone="glow" className="jc-spin w-full opacity-[0.13] sm:opacity-[0.16]" />
        </div>
        {/* 아래에서 떠오르는 거품(D4) — 세탁 모티프 장식 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {bubbles.map(({ left, size, dur, delay, alpha, pale }) => (
            <span
              key={left}
              className="jc-bub"
              style={
                {
                  left,
                  width: size,
                  height: size,
                  background: `radial-gradient(circle at 35% 35%, rgb(${
                    pale ? "166 217 250" : "255 255 255"
                  } / ${alpha[0]}), rgb(${pale ? "166 217 250" : "255 255 255"} / ${alpha[1]}))`,
                  "--bub-dur": dur,
                  "--bub-delay": delay,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <Container className="relative">
          <div className="flex flex-wrap items-center gap-10 py-16 sm:py-20 lg:gap-14 lg:py-24">
            {/* 히어로 진입은 CSS 애니메이션이다 — JS 가 실패해도 내용이 보인다 */}
            <div className="hero-enter min-w-0 max-w-[42rem] flex-[1_1_30rem]">
            <p className="mb-5 inline-flex items-center gap-2.5 text-[0.78rem] font-bold tracking-[0.13em] text-pale">
              <span className="h-0.5 w-6 rounded-full bg-ci-cyan" aria-hidden="true" />
              <T k="home.hero.eyebrow" />
            </p>

            <h1 className="text-[2.125rem] leading-[1.22] tracking-[-0.04em] sm:text-[2.75rem] lg:text-[3.375rem]">
              <T k="home.hero.title1" />
              <br />
              {/* 대상어 로테이션(D5) — 기본형 "사업장 세탁물을"만 스크린리더에 읽힌다 */}
              <RotatingWords wordKeys={rotatingWordKeys} />{" "}
              <em className="not-italic text-[#6FD6FF]"><T k="home.hero.titleEm" /></em>
            </h1>

            <p className="mt-5 max-w-[33em] text-base leading-[1.85] text-[#C8DBF2] sm:text-[1.0625rem]">
              <T k="home.hero.sub" />
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote" variant="onNavy" size="lg">
                <T k="home.hero.quoteCta" />
                <Icon.arrowRight className="size-4" />
              </ButtonLink>
              {/* 전화 버튼 기기별 분기 — PC 는 /quote, 모바일은 즉시 발신 (명세 9-3·9-4) */}
              <ContactAction kind="tel" variant="onNavyGhost" size="lg">
                <Icon.phone className="size-[1.0625rem]" />
                <span data-numeric>
                  <T k="site.tel" />
                </span>
              </ContactAction>
            </div>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {trustPoints.map((point, i) => (
                <li key={point}>
                  <Badge tone="onNavy" className="py-2">
                    <Icon.check className="size-3.5 text-[#6FD6FF]" />
                    <T k={`home.hero.trust.${i}`} />
                  </Badge>
                </li>
              ))}
            </ul>
            </div>

            {/* 글래스 일정 카드(D6) — 정기 운영 리듬의 예시 화면 */}
            <div className="jc-hero-card min-w-0 max-w-[25rem] flex-[1_1_19rem]">
              <ScheduleCard />
            </div>
          </div>
        </Container>

        {/* 마퀴 배지 스트립(D7) — 공정 키워드가 왼쪽으로 흐른다. 뒤쪽 절반은 이음새용 복제 */}
        <div className="relative overflow-hidden border-t border-white/10 py-[13px] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="jc-marquee flex [animation-duration:34s]">
            {[0, 1].map((half) => (
              <div key={half} aria-hidden={half === 1 || undefined} className="flex items-center">
                {marqueeBadgeKeys.map((k) => (
                  <span key={k} className="mr-11 flex items-center gap-11">
                    <span className="whitespace-nowrap text-[0.8125rem] font-bold tracking-[0.12em] text-[#C8DBF2]/75">
                      <T k={k} />
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element -- 13px 장식 심볼이라 최적화 대상이 아니다 */}
                    <img
                      src="/brand/jiseong-symbol-mono-white.svg"
                      alt=""
                      width={13}
                      height={15}
                      className="opacity-45"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 웨이브 섹션 전환(D8) — 이중 물결이 다음 섹션의 흰 배경으로 이어진다 */}
        <div aria-hidden="true" className="relative h-16 overflow-hidden">
          <svg
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            className="jc-wave absolute -bottom-px left-0 h-16 w-[200%] opacity-35"
          >
            <path
              fill="#FFFFFF"
              opacity="0.4"
              d="M0,46 C240,78 480,10 720,38 C960,66 1200,14 1440,46 C1680,78 1920,10 2160,38 C2400,66 2640,14 2880,46 L2880,80 L0,80 Z"
            />
          </svg>
          <svg
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            className="jc-wave-2 absolute -bottom-px left-0 h-16 w-[200%]"
          >
            <path
              fill="#FFFFFF"
              d="M0,52 C240,84 480,20 720,44 C960,68 1200,24 1440,52 C1680,84 1920,20 2160,44 C2400,68 2640,24 2880,52 L2880,80 L0,80 Z"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════ 자동 슬라이드 배너 ═══════════════ */}
      {/* 배치는 히어로 아래(지시 기본값) — 회사소개로 옮기려면 이 블록만 이동하면 된다 */}
      <Section tone="white" className="!py-10 sm:!py-12">
        <Container>
          <AutoSlider />
        </Container>
      </Section>

      {/* ═══════════════ 서비스 ═══════════════ */}
      <Section tone="white" id="services">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow={<T k="home.services.eyebrow" />}
              title={<T k="home.services.title" />}
              lede={<T k="home.services.lede" />}
            />
          </Reveal>

          {/* 서비스는 한 건으로 통합 — 카드 하나를 가운데에 둔다 */}
          {services.map((service) => {
            const Glyph = Icon[service.icon];
            return (
              <Reveal key={service.slug} delay={70}>
                {/* 상단 CI 그라디언트 바 + hover 리프트(D9) */}
                <Card className="group relative mx-auto mt-11 flex max-w-2xl flex-col overflow-hidden p-8 transition-all duration-[250ms] ease-brand hover:-translate-y-[5px] hover:border-pale hover:shadow-[0_18px_40px_-12px_rgb(20_48_110/0.22)] sm:p-10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--color-ci-deep),var(--color-ci-cyan))]"
                  />
                  <IconBubble className="mb-5">
                    <Glyph className="size-6" />
                  </IconBubble>

                  <h3 className="text-[1.1875rem] text-navy"><T k={`service.${service.slug}.title`} /></h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-[1.8] text-ink-2">
                    <T k={`service.${service.slug}.summary`} />
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {service.forWhom.map((w, wi) => (
                      <li key={w}>
                        <Chip className="text-xs"><T k={`service.${service.slug}.forWhom.${wi}`} /></Chip>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/services"
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand transition-all duration-150 group-hover:gap-2.5 hover:text-brand-hover"
                  >
                    <T k="home.services.detail" />
                    <Icon.chevronRight className="size-4" />
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </Container>
      </Section>

      {/* ═══════════════ 이용 절차 ═══════════════ */}
      <Section tone="tint" id="process">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow={<T k="home.process.eyebrow" />}
              title={<T k="home.process.title" />}
            />
          </Reveal>

          {/* 순서가 정보이므로 번호를 쓴다. jc-process 가 카드 하이라이트 시차의 기준(D10) */}
          <ol className="jc-process relative mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 데스크톱 연결선 — 화면에 들어오면 왼쪽부터 자라난다(D10) */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[3.4rem] hidden lg:block"
            >
              <Reveal
                grow
                delay={250}
                className="h-px bg-[linear-gradient(90deg,transparent,var(--color-pale)_12%,var(--color-pale)_88%,transparent)]"
              />
            </div>
            {processSteps.map((step, i) => (
              <Reveal key={step.title} as="li" delay={i * 70} className="relative">
                {/* 1→2→3→4 가 8.8초 주기로 순차 강조된다 — 시차는 globals.css */}
                <Card className="jc-step h-full p-6">
                  <span
                    className="mb-4 flex size-9 items-center justify-center rounded-full bg-navy text-sm font-extrabold text-white"
                    data-numeric
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-[1.0625rem] text-navy"><T k={`process.${i}.title`} /></h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted"><T k={`process.${i}.body`} /></p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ═══════════════ 적합 업종 ═══════════════ */}
      <Section tone="tint" className="!py-14 sm:!py-16">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow={<T k="home.industries.eyebrow" />}
              title={<T k="home.industries.title" />}
            />
          </Reveal>
          <Reveal delay={80}>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {targetIndustries.map((t, i) => {
                const Glyph = Icon[t.icon];
                return (
                  <li
                    key={t.label}
                    className="inline-flex items-center gap-2.5 rounded-brand border border-line bg-white px-5 py-3.5 text-[0.9375rem] font-bold text-navy"
                  >
                    <Glyph className="size-[1.1875rem] shrink-0 text-sky" />
                    <T k={`industries.${i}.label`} />
                  </li>
                );
              })}
            </ul>
            <div className="mt-7">
              <ButtonLink href="/quote">
                <T k="home.industries.cta" />
                <Icon.arrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ═══════════════ 사회적 가치 ═══════════════ */}
      <Section tone="navy" id="standard-workplace" className="!py-16 sm:!py-20">
        <Container>
          <div className="flex flex-wrap items-start gap-8 lg:gap-14">
            <Reveal className="min-w-0 flex-1 basis-[26rem]">
              <SectionHead
                tone="dark"
                title={<T k="home.social.title" />}
                /* 전단지에 인쇄된 문장 그대로. 방침을 덧붙이지 않는다 */
                lede={<T k="home.social.lede" />}
              />
            </Reveal>

            {/* 인증번호는 표기하지 않는다 — 인증 사실만 보여준다 */}
            <Reveal delay={100} className="shrink-0">
              <div className="inline-flex items-center gap-3.5 rounded-brand bg-white/10 px-6 py-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                <Icon.seal className="size-8 shrink-0 text-[#6FD6FF]" />
                <strong className="text-[1.0625rem] font-extrabold tracking-[-0.02em] text-white">
                  <T k="home.social.badge" />
                </strong>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 마무리 CTA ═══════════════ */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <Card className="overflow-hidden p-8 text-center sm:p-12">
              <SectionHead
                align="center"
                eyebrow={<T k="home.cta.eyebrow" />}
                title={<T k="home.cta.title" />}
                className="mx-auto"
              />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/quote" size="lg">
                  <T k="home.cta.quoteCta" />
                  <Icon.arrowRight className="size-4" />
                </ButtonLink>
                <ContactAction kind="tel" variant="ghost" size="lg">
                  <Icon.phone className="size-[1.0625rem]" />
                  <span data-numeric>
                    <T k="site.tel" />
                  </span>
                </ContactAction>
              </div>
              <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
                <Icon.pin className="size-4 text-sky" />
                <T k="site.address" />
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
