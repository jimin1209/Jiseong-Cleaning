import type { Metadata } from "next";
import { ContactAction } from "@/components/contact-action";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
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
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "서비스",
  description: "안전한 세탁·살균을 거쳐 약속된 날짜에 수거, 배송해 드립니다.",
  alternates: { canonical: "/services" },
};

/* 서비스는 한 건으로 통합됐다 — 배열 첫 항목이 통합 서비스다 */
const [service] = services;

export default function ServicesPage() {
  const Glyph = Icon[service.icon];

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
            <Card className="mx-auto max-w-3xl p-8 sm:p-10">
              <IconBubble className="mb-5">
                <Glyph className="size-6" />
              </IconBubble>

              <h2 className="text-[1.375rem] text-navy">{service.title}</h2>
              <p className="mt-3 text-[1.0625rem] leading-[1.8] text-ink-2">
                {service.summary}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-[1.8] text-muted">
                {service.lede}
              </p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {service.forWhom.map((w) => (
                  <li key={w}>
                    <Chip className="text-xs">{w}</Chip>
                  </li>
                ))}
              </ul>
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

          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {service.points.map((point, i) => (
              <Reveal key={point.title} as="li" delay={i * 70}>
                <Card className="h-full p-7">
                  <IconBubble size="sm" className="mb-4">
                    <Glyph className="size-5" />
                  </IconBubble>
                  <h3 className="text-[1.0625rem] text-navy">{point.title}</h3>
                  <p className="mt-2.5 text-sm leading-[1.75] text-ink-2">{point.body}</p>
                </Card>
              </Reveal>
            ))}
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
