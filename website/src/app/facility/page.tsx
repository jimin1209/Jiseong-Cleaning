import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { IllustrationCard } from "@/components/illustration";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  ButtonAnchor,
  ButtonLink,
  Card,
  Container,
  IconBubble,
  Section,
  SectionHead,
} from "@/components/ui";
import { businessHours, capacity, serviceAreas } from "@/lib/sample";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "시설 · 공정",
  description:
    "경주 강동면 자체 세탁 시설. 안전 세탁과 살균 공정과 위생 관리 방식, 세탁일지 제공 범위를 안내합니다.",
  alternates: { canonical: "/facility" },
};

/**
 * 공정 단계.
 *
 * ⚠️ 전단지에 인쇄된 이용 절차(문의·상담 → 수거 → 전문 세탁 → 배송)와
 *    「전문 세탁 장비와 전문 세탁 공정」 범위를 넘지 않는다.
 *    검수 기록·이력 추적 같은 세부는 앞으로 만들 시스템의 설계일 뿐
 *    현재 운영 방식이 아니므로 약속으로 적지 않는다. (lib/faq.ts 상단 주석 참고)
 */
const stages = [
  {
    title: "수거",
    body: "상담 과정을 통해서 수거 요일을 정하고 사업장을 방문해 세탁물을 수거합니다.",
  },
  {
    title: "분류",
    body: "품목과 소재에 따라 나눕니다. 수량은 이 단계에서 확인합니다.",
  },
  {
    title: "안전 세탁과 살균",
    body: "전문 설비로 안전 세탁과 살균을 거칩니다. 형광증백제·표백제 등 유해성분은 쓰지 않습니다.",
  },
  {
    title: "건조",
    body: "품목에 맞는 방식으로 건조합니다.",
  },
  {
    title: "정리",
    body: "품목별로 정리해 배달(납품) 단위로 준비합니다.",
  },
  {
    title: "배달(납품)",
    body: "정해진 요일에 사업장으로 배달(납품)합니다.",
  },
] as const;

const hygiene = [
  {
    icon: "shield" as const,
    title: "안전 세탁과 살균",
    body: "세균 잔존이 문제가 되는 세탁 품목은 안전 세탁과 살균을 거칩니다.",
  },
  {
    icon: "check" as const,
    title: "유해성분 무첨가",
    body: "형광증백제와 표백제를 쓰지 않고 전용 세제를 사용합니다.",
  },
  {
    icon: "doc" as const,
    title: "세탁일지 · 위생관리 기록",
    body: "원하실 경우 세탁일지와 위생관리 기록을 제공합니다.",
  },
  {
    icon: "building" as const,
    title: "전문 세탁 설비",
    body: "경주 강동면 사업장에서 전문 장비로 세탁합니다.",
  },
] as const;

export default function FacilityPage() {
  return (
    <>
      <PageHero
        eyebrow="시 설 · 공 정"
        title="경주 강동면 사업장에서 세탁합니다"
        lede="전문 세탁 장비와 전문 세탁 공정으로 사업장 세탁물을 세탁합니다. 아래는 수거부터 배달(납품)까지의 흐름입니다."
      />

      {/* ═══════════════ 사진 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="시 설"
              title="설비와 작업 현장"
              lede="전문 세탁기와 건조기, 프레스, 분류·적재 공간으로 이루어져 있습니다."
            />
          </Reveal>

          {capacity && (
            <Reveal delay={60}>
              <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {capacity.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-brand border border-line bg-white px-5 py-4 shadow-card"
                  >
                    <dt className="text-[0.75rem] font-bold tracking-[0.08em] text-faint">
                      {c.label}
                    </dt>
                    <dd className="m-0 mt-1.5 text-[1.5rem] font-extrabold tracking-[-0.03em] text-navy">
                      <span data-numeric>{c.value}</span>
                      <span className="ml-1 text-[0.875rem] font-bold text-muted">
                        {c.unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                {
                  variant: "machines",
                  title: "세탁 설비 전경",
                  caption: "전문 세탁기 · 건조기 라인",
                },
                {
                  variant: "inspect",
                  title: "품목 검수",
                  caption: "입고 시 분류와 수량 확인",
                },
                {
                  variant: "press",
                  title: "건조 · 프레스",
                  caption: "품목별 건조와 유니폼 마감",
                },
                {
                  variant: "linen",
                  title: "정리 · 적재",
                  caption: "배달(납품) 단위 포장",
                },
                {
                  variant: "shelf",
                  title: "출고 대기",
                  caption: "거래처별 분류 선반",
                },
                {
                  variant: "truck",
                  title: "배송 차량",
                  caption: "자체 수거 · 배달(납품) 차량",
                },
              ] as const
            ).map((shot, i) => (
              <Reveal key={shot.title} delay={(i % 3) * 70}>
                <IllustrationCard
                  variant={shot.variant}
                  title={shot.title}
                  caption={shot.caption}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 공정 ═══════════════ */}
      <Section tone="tint">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="공 정"
              title="수거된 세탁물이 거치는 순서"
              lede="수량이나 상태에 이의가 있으면 연락해 주세요. 확인 후 안내해 드립니다."
            />
          </Reveal>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage, i) => (
              <Reveal key={stage.title} as="li" delay={(i % 3) * 70}>
                <Card className="flex h-full gap-4 p-6">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-extrabold text-white"
                    data-numeric
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[1.0625rem] text-navy">{stage.title}</h3>
                    <p className="mt-2 text-sm leading-[1.7] text-ink-2">{stage.body}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ═══════════════ 위생 관리 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="위 생 관 리"
              title="무엇을 넣지 않고 어떤 공정을 거치는지"
              lede="주방 세탁물과 숙박 세탁물은 음식과 피부에 닿는 물품입니다. 그 기준으로 세제와 공정을 정하고 있습니다."
            />
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {hygiene.map((h, i) => {
              const Glyph = Icon[h.icon];
              return (
                <Reveal key={h.title} as="li" delay={(i % 2) * 70}>
                  <Card className="flex h-full gap-4 p-7">
                    <IconBubble size="sm" className="shrink-0">
                      <Glyph className="size-5" />
                    </IconBubble>
                    <div className="min-w-0">
                      <h3 className="text-[1.0625rem] text-navy">{h.title}</h3>
                      <p className="mt-2 text-sm leading-[1.75] text-ink-2">{h.body}</p>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </ul>


          {/* 운영 시간 · 서비스 권역 */}
          {(businessHours || serviceAreas) && (
            <Reveal delay={180}>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {businessHours && (
                  <Card className="p-6">
                    <h3 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                      운 영 시 간
                    </h3>
                    <dl className="mt-4 flex flex-col gap-2.5 text-[0.9375rem]">
                      {[
                        ["평일", businessHours.weekday],
                        ["토요일", businessHours.saturday],
                        ["휴무", businessHours.holiday],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <dt className="w-14 shrink-0 text-[0.8125rem] font-bold text-muted">
                            {k}
                          </dt>
                          <dd className="m-0 text-ink-2" data-numeric>
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 border-t border-line pt-3.5 text-[0.8125rem] leading-[1.7] text-muted">
                      수거 · 배달(납품) 시간은 사업장 일정에 맞춰 상담 시 정합니다.
                    </p>
                  </Card>
                )}

                {serviceAreas && (
                  <Card className="p-6">
                    <h3 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                      수 거 · 납 품 권 역
                    </h3>
                    <div className="mt-4 flex flex-col gap-3.5">
                      <div>
                        <span className="text-[0.75rem] font-bold text-sky">주 권역</span>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {serviceAreas.primary.map((a) => (
                            <li key={a}>
                              <span className="inline-flex rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
                                {a}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[0.75rem] font-bold text-muted">
                          협의 가능
                        </span>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {serviceAreas.secondary.map((a) => (
                            <li key={a}>
                              <span className="inline-flex rounded-full bg-tint px-3 py-1 text-xs font-semibold text-navy">
                                {a}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-4 border-t border-line pt-3.5 text-[0.8125rem] leading-[1.7] text-muted">
                      사업장 지역을 알려 주시면 가능 여부를 확인해 드립니다.
                    </p>
                  </Card>
                )}
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* ═══════════════ CTA ═══════════════ */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <Card className="p-8 sm:p-11">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <SectionHead
                  title="더 자세한 내용이 필요하시면 문의해 주세요"
                  lede="물량을 알려 주시면 맞는 방식으로 안내해 드립니다."
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
        </Container>
      </Section>
    </>
  );
}
