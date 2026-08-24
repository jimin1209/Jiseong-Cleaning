import { BrandMark } from "@/components/brand-mark";
import { FaqJsonLd, FaqList } from "@/components/faq-list";
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
import { faqs } from "@/lib/faq";
import { processSteps, reasons, services } from "@/lib/services";
import { certification } from "@/lib/sample";
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
              기업 · 펜션 · 호텔 · 모텔 · 사우나 세탁물 세탁 전문
            </p>

            <h1 className="text-[2.125rem] leading-[1.22] tracking-[-0.04em] sm:text-[2.75rem] lg:text-[3.375rem]">
              수거부터 배달(납품)까지
              <br />
              사업장 세탁물을{" "}
              <em className="not-italic text-[#6FD6FF]">대신 관리합니다</em>
            </h1>

            <p className="mt-5 max-w-[33em] text-base leading-[1.85] text-[#C8DBF2] sm:text-[1.0625rem]">
              안전한 세탁·살균을 거쳐 약속한 날짜에 수거·배달해 드립니다.
              기업·호텔·모텔·펜션·사우나 세탁물과 식당·급식소 세탁물을 사업장 단위로
              정기 세탁합니다.
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
              eyebrow="세 탁 서 비 스"
              title="사업장 규모에 맞춰 정해진 날짜에 관리해 드립니다"
              lede="품목과 물량, 수거 날짜만 알려 주시면 사업장에 맞는 방식으로 제안해 드립니다."
            />
          </Reveal>

          <ul className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Glyph = Icon[service.icon];
              return (
                <Reveal key={service.slug} as="li" delay={i * 70}>
                  <Card className="group flex h-full flex-col p-7 transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-pale hover:shadow-raised">
                    <IconBubble className="mb-5">
                      <Glyph className="size-6" />
                    </IconBubble>

                    <h3 className="text-[1.1875rem] text-navy">{service.title}</h3>
                    <p className="mt-2.5 text-sm leading-[1.75] text-ink-2">
                      {service.summary}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {service.forWhom.slice(0, 4).map((w) => (
                        <li key={w}>
                          <Chip className="text-xs">{w}</Chip>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ═══════════════ 이용 절차 ═══════════════ */}
      <Section tone="tint" id="process">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="이 용 절 차"
              title="처음 상담부터 처음 배달(납품)까지 세 단계"
              lede="날짜를 정하고 나면 그 일정에 맞춰 수거와 배달(납품)이 이어집니다."
            />
          </Reveal>

          {/* 순서가 정보이므로 번호를 쓴다 */}
          <ol className="relative mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ═══════════════ 강점 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="왜 지 성 크 리 닝 인 가"
              title="정기 세탁에 필요한 것을 갖추고 있습니다"
              lede="사업장 세탁물은 품목과 물량이 일정해서, 날짜와 공정이 맞아야 운영이 편해집니다."
            />
          </Reveal>

          <ul className="mt-11 grid overflow-hidden rounded-brand border border-line sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => {
              const Glyph = Icon[reason.icon];
              return (
                <Reveal
                  key={reason.title}
                  as="li"
                  delay={(i % 3) * 70}
                  className="flex gap-4 border-b border-line p-7 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0 sm:[&:nth-child(odd)]:border-r sm:border-line lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r"
                >
                  <Glyph className="mt-0.5 size-6 shrink-0 text-sky" />
                  <div>
                    <h3 className="text-[1.0625rem] text-navy">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-[1.75] text-ink-2">{reason.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ═══════════════ 적합 업종 ═══════════════ */}
      <Section tone="tint" className="!py-14 sm:!py-16">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="이 런 곳 에 적 합 합 니 다"
              title="사업장 단위로 계약합니다"
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
            <p className="mt-5 text-sm text-muted">
              사업장 고객 전문 세탁 플랫폼입니다.
            </p>
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

            <Reveal delay={100} className="shrink-0">
              <div className="inline-flex items-center gap-3.5 rounded-brand bg-white/10 px-6 py-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                <Icon.seal className="size-8 shrink-0 text-[#6FD6FF]" />
                <span>
                  <strong className="block text-[1.0625rem] font-extrabold tracking-[-0.02em] text-white">
                    장애인 표준사업장
                  </strong>
                  <span className="mt-0.5 block text-[0.8125rem] text-[#A6C5E8]">
                    {certification
                      ? `${certification.issuer} · ${certification.number}`
                      : "인증기관 · 인증번호 확인 후 표기"}
                  </span>
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 자주 묻는 질문 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="자 주 묻 는 질 문"
              title="거래를 검토하실 때 가장 많이 물어보시는 것들"
              lede="더 궁금하신 점은 연락 주시면 상세히 설명해 드립니다."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-9">
              {/* 홈에는 앞 6개만. 전체는 견적 문의 페이지에 있다 */}
              <FaqList items={faqs.slice(0, 6)} />
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-6">
              <ButtonLink href="/quote#faq" variant="ghost">
                질문 전체 보기
                <Icon.chevronRight className="size-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
        <FaqJsonLd items={faqs} />
      </Section>

      {/* ═══════════════ 마무리 CTA ═══════════════ */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <Card className="overflow-hidden p-8 text-center sm:p-12">
              <SectionHead
                align="center"
                eyebrow="견 적 · 상 담 문 의"
                title="물량과 날짜만 알려 주시면 바로 견적을 드립니다"
                lede="연락 주시면 견적을 상담해 드립니다."
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
