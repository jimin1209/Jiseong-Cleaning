import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  ButtonAnchor,
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
  description:
    "기업·호텔·모텔·펜션·사우나 세탁물 세탁, 식당·급식소 세탁물 세탁, 월 세탁 정기 계약. 관리 품목과 운영 방식을 안내합니다.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="세 탁 서 비 스"
        title="사업장 규모에 맞춰 정해진 날짜에 관리해 드립니다"
        lede="어느 쪽이 맞는지 판단이 어려우시면 현재 이용 중인 방식과 월 물량만 알려주세요. 비교해서 제안해 드립니다."
      />

      <Section tone="white">
        <Container>
          <ul className="grid gap-6 lg:grid-cols-3">
            {services.map((service, i) => {
              const Glyph = Icon[service.icon];
              return (
                <Reveal key={service.slug} as="li" delay={i * 70}>
                  <Card className="flex h-full flex-col p-7">
                    <IconBubble className="mb-5">
                      <Glyph className="size-6" />
                    </IconBubble>

                    <h2 className="text-[1.1875rem] text-navy">{service.title}</h2>
                    <p className="mt-2.5 text-sm leading-[1.75] text-ink-2">
                      {service.summary}
                    </p>

                    <div className="mt-5">
                      <h3 className="text-[0.6875rem] font-bold tracking-[0.14em] text-faint">
                        주 요 품 목
                      </h3>
                      <ul className="mt-2.5 flex flex-col gap-1.5 text-sm text-ink-2">
                        {service.itemGroups
                          .flatMap((g) => g.items)
                          .slice(0, 5)
                          .map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-sky" aria-hidden="true">
                                ·
                              </span>
                              {item}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {service.forWhom.map((w) => (
                        <li key={w}>
                          <Chip className="text-xs">{w}</Chip>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand hover:text-brand-hover"
                    >
                      자세히 보기
                      <Icon.chevronRight className="size-4" />
                    </Link>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <SectionHead
                title="어느 쪽인지 모르셔도 됩니다"
                lede="품목과 주당 물량만 알려 주시면 어떤 방식이 유리한지 비교해 드립니다."
                className="flex-1 basis-[24rem]"
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
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
