import type { Metadata } from "next";
import { ContactAction } from "@/components/contact-action";
import { T } from "@/components/copy-text";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ScheduleCard } from "@/components/schedule-card";
import {
  Alert,
  ButtonLink,
  Card,
  Chip,
  Container,
  IconBubble,
  Section,
  SectionHead,
} from "@/components/ui";
import { industryNotes } from "@/lib/sample";
import { services } from "@/lib/services";
import { targetIndustries } from "@/lib/site";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "서비스",
  description: "안전한 세탁·살균을 거쳐 약속된 날짜에 수거, 배송해 드립니다.",
  alternates: { canonical: "/services" },
};

/* 서비스는 한 건으로 통합됐다 — 배열 첫 항목이 통합 서비스다 */
const [service] = services;

/** 운영 방식 카드 아이콘 — points 배열 순서(수거·배송 → 세탁·살균 → 계약)와 짝 */
const pointIcons = ["truck", "shield", "contract"] as const;

/** 카드 공통 hover 리프트 — 홈 서비스 카드(D9)와 같은 값 */
const cardLift =
  "transition duration-300 ease-brand hover:-translate-y-[5px] hover:shadow-raised";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow={<T k="services.hero.eyebrow" />}
        title={<T k="services.hero.title" />}
        lede={<T k="services.hero.lede" />}
      />

      {/* ═══════════════ 통합 서비스 소개 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <Card className={`p-8 sm:p-10 ${cardLift}`}>
              <div className="flex flex-wrap items-center gap-9">
                <div className="min-w-0 flex-[1_1_26rem]">
                  <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-brand">
                    <T k="services.core.eyebrow" />
                  </p>
                  <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.42] tracking-[-0.03em] text-navy">
                    <T k={`service.${service.slug}.summary`} />
                  </h2>
                </div>
                <ul className="flex flex-[0_1_18.75rem] flex-wrap content-center gap-2">
                  {targetIndustries.map((t, i) => (
                    <li key={t.label}>
                      <Chip><T k={`industries.${i}.label`} /></Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Alert tone="warn" className="mx-auto mt-6 max-w-3xl">
              <T k={`service.${service.slug}.priceNote`} />
            </Alert>
          </Reveal>
        </Container>
      </Section>

      {/* ═══════════════ 운영 방식 ═══════════════ */}
      <Section tone="tint">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow={<T k="services.ops.eyebrow" />}
              title={<T k="services.ops.title" />}
            />
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.points.map((point, i) => {
              const Glyph = Icon[pointIcons[i] ?? service.icon];
              return (
                <Reveal key={point.title} as="li" delay={i * 120}>
                  <Card className={`h-full p-7 ${cardLift}`}>
                    <IconBubble size="sm" className="mb-4">
                      <Glyph className="size-5" />
                    </IconBubble>
                    <h3 className="text-[1.0625rem] text-navy">
                      <T k={`service.${service.slug}.points.${i}.title`} />
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.75] text-ink-2">
                      <T k={`service.${service.slug}.points.${i}.body`} />
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ═══════════════ 주간 리듬 ═══════════════ */}
      <Section tone="navy" className="relative overflow-hidden">
        {/* 배경 글로우 — 홈 히어로(D3)의 jc-glow 재사용, 주기·방향만 시안값으로 오버라이드 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="jc-glow absolute -right-[7.5rem] -top-40 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(0_174_239/0.22)_0%,rgb(0_174_239/0)_70%)] [animation-duration:16s]" />
          <div className="jc-glow absolute -bottom-[12.5rem] -left-[8.75rem] size-[27.5rem] rounded-full bg-[radial-gradient(circle,rgb(46_49_146/0.5)_0%,rgb(46_49_146/0)_70%)] [animation-direction:reverse] [animation-duration:20s]" />
        </div>

        <Container className="relative">
          <Reveal>
            <SectionHead
              tone="dark"
              align="center"
              eyebrow={<T k="services.rhythm.eyebrow" />}
              title={<T k="services.rhythm.title" />}
            />
          </Reveal>

          <div className="mt-9 flex justify-center">
            {/* 홈 히어로의 예시 일정 카드를 중앙에 크게 — 카드 자체가 예시·aria-hidden */}
            <Reveal className="w-full max-w-[26.25rem]">
              <ScheduleCard />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 업종별 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow={<T k="services.byIndustry.eyebrow" />}
              title={<T k="services.byIndustry.title" />}
            />
          </Reveal>

          <ul className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {targetIndustries.map((t, i) => {
              const Glyph = Icon[t.icon];
              return (
                <Reveal key={t.label} as="li" delay={i * 70}>
                  <div className="h-full rounded-brand border border-line bg-white px-[1.375rem] py-5">
                    <Chip>
                      <Glyph className="size-[0.9375rem] shrink-0" />
                      <T k={`industries.${i}.label`} />
                    </Chip>
                    {/* 한 줄 소개는 확정 전 더미(sample.ts) — 꺼지면 칩만 남는다 */}
                    {industryNotes?.[t.label] && (
                      <p className="mt-3 text-sm leading-[1.7] text-ink-2">
                        <T k={`industries.${i}.note`} />
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ═══════════════ 마무리 CTA ═══════════════ */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <SectionHead
                title={<T k="services.cta.title" />}
                className="flex-1 basis-[24rem]"
              />
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/quote" size="lg">
                  <T k="services.cta.quoteCta" />
                  <Icon.arrowRight className="size-4" />
                </ButtonLink>
                <ContactAction kind="tel" variant="ghost" size="lg">
                  <Icon.phone className="size-[1.0625rem]" />
                  <span data-numeric>
                    <T k="site.tel" />
                  </span>
                </ContactAction>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
