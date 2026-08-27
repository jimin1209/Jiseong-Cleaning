import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  Badge,
  ButtonAnchor,
  ButtonLink,
  Card,
  Chip,
  Container,
  IconBubble,
  Section,
  SectionHead,
} from "@/components/ui";
import { processSteps, services } from "@/lib/services";
import { site, targetIndustries, trustPoints } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ═══════════════ 히어로 ═══════════════ */}
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#0E2450_0%,#14306E_42%,#1B4FA8_100%)] text-white">
        {/* 시안 글로우 — 장식이므로 클릭을 막는다 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8%] -top-[22%] aspect-square w-[min(46rem,72vw)] bg-[radial-gradient(circle_at_50%_50%,rgb(0_174_239/0.30)_0%,rgb(0_174_239/0)_62%)]"
        />
        {/* 심볼 워터마크 */}
        <BrandMark
          tone="glow"
          className="pointer-events-none absolute -right-[26%] top-1/2 w-[min(38rem,90vw)] -translate-y-1/2 opacity-[0.13] sm:-right-[6%] sm:opacity-[0.16]"
        />

        <Container className="relative">
          {/* 히어로 진입은 CSS 애니메이션이다 — JS 가 실패해도 내용이 보인다 */}
          <div className="hero-enter max-w-[42rem] py-16 sm:py-20 lg:py-28">
            <p className="mb-5 inline-flex items-center gap-2.5 text-[0.78rem] font-bold tracking-[0.13em] text-pale">
              <span className="h-0.5 w-6 rounded-full bg-ci-cyan" aria-hidden="true" />
              사업장 세탁 전문
            </p>

            <h1 className="text-[2.125rem] leading-[1.22] tracking-[-0.04em] sm:text-[2.75rem] lg:text-[3.375rem]">
              수거부터 배송까지
              <br />
              사업장 세탁물을{" "}
              <em className="not-italic text-[#6FD6FF]">대신 관리해 드립니다</em>
            </h1>

            <p className="mt-5 max-w-[33em] text-base leading-[1.85] text-[#C8DBF2] sm:text-[1.0625rem]">
              약속한 날짜에 수거하고, 세탁·살균을 거쳐 배송합니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote" variant="onNavy" size="lg">
                견적 문의하기
                <Icon.arrowRight className="size-4" />
              </ButtonLink>
              <ButtonAnchor href={site.telHref} variant="onNavyGhost" size="lg">
                <Icon.phone className="size-[1.0625rem]" />
                <span data-numeric>{site.tel}</span>
              </ButtonAnchor>
            </div>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {trustPoints.map((point) => (
                <li key={point}>
                  <Badge tone="onNavy" className="py-2">
                    <Icon.check className="size-3.5 text-[#6FD6FF]" />
                    {point}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ═══════════════ 서비스 ═══════════════ */}
      <Section tone="white" id="services">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="서 비 스"
              title="사업장 규모, 품목과 물량에 따라 주기적으로 관리해 드립니다"
              lede="품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다."
            />
          </Reveal>

          {/* 서비스는 한 건으로 통합 — 카드 하나를 가운데에 둔다 */}
          {services.map((service) => {
            const Glyph = Icon[service.icon];
            return (
              <Reveal key={service.slug} delay={70}>
                <Card className="group mx-auto mt-11 flex max-w-2xl flex-col p-8 transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-pale hover:shadow-raised sm:p-10">
                  <IconBubble className="mb-5">
                    <Glyph className="size-6" />
                  </IconBubble>

                  <h3 className="text-[1.1875rem] text-navy">{service.title}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-[1.8] text-ink-2">
                    {service.summary}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {service.forWhom.map((w) => (
                      <li key={w}>
                        <Chip className="text-xs">{w}</Chip>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/services"
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand transition-all duration-150 group-hover:gap-2.5 hover:text-brand-hover"
                  >
                    자세히 보기
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
              eyebrow="이 용 절 차"
              title="첫 상담부터 배송까지"
            />
          </Reveal>

          {/* 순서가 정보이므로 번호를 쓴다 */}
          <ol className="relative mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 데스크톱 연결선 */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[3.4rem] hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-pale)_12%,var(--color-pale)_88%,transparent)] lg:block"
            />
            {processSteps.map((step, i) => (
              <Reveal key={step.title} as="li" delay={i * 70} className="relative">
                <Card className="h-full p-6">
                  <span
                    className="mb-4 flex size-9 items-center justify-center rounded-full bg-navy text-sm font-extrabold text-white"
                    data-numeric
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-[1.0625rem] text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted">{step.body}</p>
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
              eyebrow="이 런 곳 에 적 합 합 니 다"
              title="확인 후 연락드립니다."
            />
          </Reveal>
          <Reveal delay={80}>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {targetIndustries.map((t) => {
                const Glyph = Icon[t.icon];
                return (
                  <li
                    key={t.label}
                    className="inline-flex items-center gap-2.5 rounded-brand border border-line bg-white px-5 py-3.5 text-[0.9375rem] font-bold text-navy"
                  >
                    <Glyph className="size-[1.1875rem] shrink-0 text-sky" />
                    {t.label}
                  </li>
                );
              })}
            </ul>
            <div className="mt-7">
              <ButtonLink href="/quote">
                바로 문의하기
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
                title="장애인 표준사업장으로 운영합니다"
                /* 전단지에 인쇄된 문장 그대로. 방침을 덧붙이지 않는다 */
                lede="지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다."
              />
            </Reveal>

            {/* 인증번호는 표기하지 않는다 — 인증 사실만 보여준다 */}
            <Reveal delay={100} className="shrink-0">
              <div className="inline-flex items-center gap-3.5 rounded-brand bg-white/10 px-6 py-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                <Icon.seal className="size-8 shrink-0 text-[#6FD6FF]" />
                <strong className="text-[1.0625rem] font-extrabold tracking-[-0.02em] text-white">
                  장애인 표준사업장 인증
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
                eyebrow="견 적 · 상 담 문 의"
                title="확인 후 연락드립니다."
                className="mx-auto"
              />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/quote" size="lg">
                  견적 문의하기
                  <Icon.arrowRight className="size-4" />
                </ButtonLink>
                <ButtonAnchor href={site.telHref} variant="ghost" size="lg">
                  <Icon.phone className="size-[1.0625rem]" />
                  <span data-numeric>{site.tel}</span>
                </ButtonAnchor>
              </div>
              <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
                <Icon.pin className="size-4 text-sky" />
                {site.address}
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
