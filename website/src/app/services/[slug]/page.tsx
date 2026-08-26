import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  Alert,
  ButtonAnchor,
  ButtonLink,
  Card,
  Container,
  IconBubble,
  Section,
  SectionHead,
} from "@/components/ui";
import { getService, processSteps, services } from "@/lib/services";
import { site } from "@/lib/site";

/** 세 페이지 모두 빌드 시점에 정적으로 생성한다 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.title, description: service.summary },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);
  const Glyph = Icon[service.icon];

  return (
    <>
      <PageHero
        eyebrow="서 비 스"
        title={service.title}
        lede={service.lede}
        aside={
          <ul className="flex max-w-[16rem] flex-wrap gap-2">
            {service.forWhom.map((w) => (
              <li
                key={w}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-pale shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]"
              >
                {w}
              </li>
            ))}
          </ul>
        }
      />

      {/* ═══════════════ 관리 품목 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="취 급 품 목"
              title="지성크리닝에서 관리하는 품목입니다"
              lede="목록에 없는 품목도 상담 가능합니다. 커튼·카펫처럼 크기와 소재에 따라 달라지는 세탁 품목은 별도로 협의하여 진행합니다."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.itemGroups.map((group, i) => (
              <Reveal key={group.label} delay={i * 70}>
                <Card className="h-full p-6">
                  <h3 className="flex items-center gap-2.5 text-[0.6875rem] font-bold tracking-[0.14em] text-faint">
                    <span className="h-0.5 w-4 rounded-full bg-pale" aria-hidden="true" />
                    {group.label}
                  </h3>
                  <ul className="mt-4 flex flex-col">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 border-b border-dashed border-line py-2.5 text-[0.9375rem] text-ink-2 last:border-b-0"
                      >
                        <Icon.check className="mt-1 size-3.5 shrink-0 text-sky" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <Alert tone="warn" className="mt-8 max-w-3xl">
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

      {/* ═══════════════ 이용 절차 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="이 용 절 차"
              title="처음 상담부터 처음 배달(납품)까지 세 단계"
              lede="날짜를 정하고 나면 그 일정에 맞춰 수거와 배달(납품)이 이어집니다."
            />
          </Reveal>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} as="li" delay={i * 60}>
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

      {/* ═══════════════ CTA + 다른 서비스 ═══════════════ */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <Card className="p-8 sm:p-11">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <SectionHead
                  title="물량만 알려 주시면 견적을 드립니다"
                  lede="담당자가 확인 후 연락드립니다."
                  className="flex-1 basis-[22rem]"
                />
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/quote" size="lg">
                    견적 문의하기
                    <Icon.arrowRight className="size-4" />
                  </ButtonLink>
                  <ButtonAnchor href={site.telHref} variant="ghost" size="lg">
                    <Icon.phone className="size-[1.0625rem]" />
                    <span data-numeric>{site.tel}</span>
                  </ButtonAnchor>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10">
              <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                다 른 서 비 스
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {others.map((other) => {
                  const OtherGlyph = Icon[other.icon];
                  return (
                    <li key={other.slug}>
                      <Link
                        href={`/services/${other.slug}`}
                        className="group flex items-center gap-4 rounded-brand border border-line bg-white p-5 transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-pale hover:shadow-raised"
                      >
                        <IconBubble size="sm">
                          <OtherGlyph className="size-5" />
                        </IconBubble>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-[0.9375rem] font-bold text-navy">
                            {other.title}
                          </strong>
                          <span className="mt-0.5 block text-[0.8125rem] text-muted">
                            {other.summary}
                          </span>
                        </span>
                        <Icon.chevronRight className="size-4 shrink-0 text-brand transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
