import type { Metadata } from "next";
import { ContactAction } from "@/components/contact-action";
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
import { site, targetIndustries } from "@/lib/site";
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
        eyebrow="서 비 스"
        title="사업장 규모, 품목과 물량에 따라 주기적으로 관리해 드립니다"
        lede="품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다."
      />

      {/* ═══════════════ 통합 서비스 소개 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <Card className={`p-8 sm:p-10 ${cardLift}`}>
              <div className="flex flex-wrap items-center gap-9">
                <div className="min-w-0 flex-[1_1_26rem]">
                  <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-brand">
                    하나의 서비스, 사업장마다 다른 리듬
                  </p>
                  <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.42] tracking-[-0.03em] text-navy">
                    {service.summary}
                  </h2>
                </div>
                <ul className="flex flex-[0_1_18.75rem] flex-wrap content-center gap-2">
                  {targetIndustries.map((t) => (
                    <li key={t.label}>
                      <Chip>{t.label}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Alert tone="warn" className="mx-auto mt-6 max-w-3xl">
              {service.priceNote}
            </Alert>
          </Reveal>
        </Container>
      </Section>

      {/* ═══════════════ 운영 방식 ═══════════════ */}
      <Section tone="tint">
        <Container>
          <Reveal>
            <SectionHead eyebrow="운 영 방 식" title="이렇게 운영합니다" />
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
                    <h3 className="text-[1.0625rem] text-navy">{point.title}</h3>
                    <p className="mt-2.5 text-sm leading-[1.75] text-ink-2">{point.body}</p>
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
              eyebrow="주 간 리 듬"
              title="사업장의 한 주에 세탁의 박자를 맞춥니다"
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
            <SectionHead eyebrow="업 종 별" title="이런 사업장과 함께합니다" />
          </Reveal>

          <ul className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {targetIndustries.map((t, i) => {
              const Glyph = Icon[t.icon];
              return (
                <Reveal key={t.label} as="li" delay={i * 70}>
                  <div className="h-full rounded-brand border border-line bg-white px-[1.375rem] py-5">
                    <Chip>
                      <Glyph className="size-[0.9375rem] shrink-0" />
                      {t.label}
                    </Chip>
                    {/* 한 줄 소개는 확정 전 더미(sample.ts) — 꺼지면 칩만 남는다 */}
                    {industryNotes?.[t.label] && (
                      <p className="mt-3 text-sm leading-[1.7] text-ink-2">
                        {industryNotes[t.label]}
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
                title="확인 후 연락드립니다."
                className="flex-1 basis-[24rem]"
              />
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/quote" size="lg">
                  견적 문의하기
                  <Icon.arrowRight className="size-4" />
                </ButtonLink>
                <ContactAction kind="tel" variant="ghost" size="lg">
                  <Icon.phone className="size-[1.0625rem]" />
                  <span data-numeric>{site.tel}</span>
                </ContactAction>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
