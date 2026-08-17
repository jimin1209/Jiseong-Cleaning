import type { Metadata } from "next";
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
  PhotoSlot,
  Section,
  SectionHead,
} from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "시설 · 공정",
  description:
    "경주 천북면 자체 세탁 시설. 고온 세탁·살균 공정과 위생 관리 방식, 세탁일지 제공 범위를 안내합니다.",
  alternates: { canonical: "/facility" },
};

/** 공정 단계 — 수거된 세탁물이 실제로 거치는 순서 */
const stages = [
  {
    title: "입고 · 품목 검수",
    body: "수거한 세탁물을 품목별로 분류하고 수량을 확인합니다. 발주 수량과 다르면 사유를 기록해 거래처에 알립니다.",
  },
  {
    title: "분류 · 전처리",
    body: "소재와 오염도에 따라 나눕니다. 얼룩이 있는 품목은 본 세탁 전에 따로 처리합니다.",
  },
  {
    title: "고온 세탁 · 살균",
    body: "업소용 설비로 고온 세탁과 살균을 거칩니다. 형광증백제·표백제 등 유해성분은 쓰지 않습니다.",
  },
  {
    title: "건조 · 마감",
    body: "품목에 맞는 방식으로 건조하고, 유니폼처럼 형태가 중요한 품목은 프레스로 마감합니다.",
  },
  {
    title: "정리 · 적재",
    body: "품목별로 정리해 납품 단위로 적재합니다. 요청하시면 낱개 포장도 가능합니다.",
  },
  {
    title: "납품",
    body: "자체 차량으로 정해진 요일에 사업장으로 납품합니다.",
  },
] as const;

const hygiene = [
  {
    icon: "shield" as const,
    title: "고온 세탁 · 살균",
    body: "세균 잔존이 문제가 되는 품목은 고온 세탁과 살균을 기본 공정으로 거칩니다.",
  },
  {
    icon: "check" as const,
    title: "유해성분 무첨가",
    body: "형광증백제와 표백제를 쓰지 않습니다. 음식과 피부에 닿는 물품이라는 점을 기준으로 세제를 고릅니다.",
  },
  {
    icon: "doc" as const,
    title: "세탁일지 · 위생관리 기록",
    body: "위생 점검과 감사에 대비해 세탁 기록을 제공합니다. 요청하시면 정기 발행합니다.",
  },
  {
    icon: "truck" as const,
    title: "재위탁 없음",
    body: "수거한 세탁물을 다른 업체로 넘기지 않습니다. 자사 시설에서 직접 처리합니다.",
  },
] as const;

export default function FacilityPage() {
  return (
    <>
      <PageHero
        eyebrow="시 설 · 공 정"
        title="경주 천북면에 자체 세탁 시설을 두고 있습니다"
        lede="수거한 세탁물은 외부에 재위탁하지 않습니다. 입고부터 납품까지 한 곳에서 처리하기 때문에 문제가 생겼을 때 어느 단계였는지 추적할 수 있습니다."
      />

      {/* ═══════════════ 사진 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="시 설"
              title="설비와 작업 현장"
              lede="스톡 이미지를 쓰지 않습니다. 실제 시설을 촬영해 이 자리에 올릴 예정입니다."
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "세탁 설비 전경", caption: "업소용 세탁기 · 건조기 라인" },
              { title: "고온 세탁 · 살균", caption: "세제 투입부터 탈수까지" },
              { title: "건조 · 프레스", caption: "품목별 건조와 유니폼 마감" },
              { title: "품목 검수", caption: "입고 시 분류와 수량 확인" },
              { title: "정리 · 적재", caption: "납품 단위 포장" },
              { title: "배송 차량", caption: "자체 수거 · 납품 차량" },
            ].map((shot, i) => (
              <Reveal key={shot.title} delay={(i % 3) * 70}>
                <PhotoSlot title={shot.title} caption={shot.caption} />
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
              lede="각 단계에 담당자와 처리 시각이 기록됩니다. 수량이나 상태에 이의가 있으면 해당 단계를 확인해 답을 드립니다."
            />
          </Reveal>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              title="형용사 대신 공정으로 설명합니다"
              lede="「깨끗합니다」는 확인할 수 없는 말입니다. 무엇을 넣지 않고 어떤 공정을 거치는지로 적었습니다."
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

          <Reveal delay={140}>
            <Alert tone="warn" className="mt-8 max-w-3xl">
              세탁일지·위생관리 기록의 제공 범위는 품목에 따라 다릅니다. 필요한 서식이
              있으시면 상담 시 알려주세요.
            </Alert>
          </Reveal>
        </Container>
      </Section>

      {/* ═══════════════ CTA ═══════════════ */}
      <Section tone="paper">
        <Container>
          <Reveal>
            <Card className="p-8 sm:p-11">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <SectionHead
                  title="직접 보고 판단하셔도 됩니다"
                  lede="시설 방문을 원하시면 일정을 조율해 안내해 드립니다."
                  className="flex-1 basis-[22rem]"
                />
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/quote" size="lg">
                    견적 · 방문 문의
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
