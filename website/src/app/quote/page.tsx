import type { Metadata } from "next";
import { FaqJsonLd, FaqList } from "@/components/faq-list";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ButtonAnchor, Card, Container, Section, SectionHead } from "@/components/ui";
import { businessHours, SAMPLE_CONTENT } from "@/lib/sample";
import { processSteps } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "견적 · 상담 문의",
  description:
    "물량을 알려 주시면 담당자가 확인해 견적을 드립니다. 전화 010-9828-3637.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="견 적 · 상 담 문 의"
        title="사업장 세탁물을 관리해 드립니다"
        lede="연락 주시면 담당자와 견적 상담이 가능합니다."
      />

      <Section tone="white">
        <Container>
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="rounded-brand bg-navy px-7 py-10 text-center text-white shadow-raised sm:px-12 sm:py-14">
                <p className="text-[1.875rem] font-extrabold tracking-[-0.025em] text-pale sm:text-[2.5rem]">
                  상 담 및 견 적 문 의
                </p>
                <a
                  href={site.telHref}
                  className="mt-4 block text-[1.25rem] font-extrabold tracking-normal text-white transition-colors hover:text-pale sm:text-[1.5rem]"
                  data-numeric
                >
                  {site.tel}
                </a>
                <p className="mx-auto mt-4 max-w-xl text-base leading-[1.8] text-[#C7D9ED]">
                  전화로 물량과 희망 날짜를 알려 주시면 담당자가 상담 후 견적을 안내해 드립니다.
                </p>
                {businessHours && (
                  <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-[#A6C5E8]">
                    <p data-numeric>{businessHours.weekday}</p>
                    <p data-numeric>{businessHours.saturday}</p>
                    <p>{businessHours.holiday}</p>
                  </div>
                )}
                <ButtonAnchor href={site.telHref} className="mt-8" size="lg">
                  전화로 견적 문의하기
                </ButtonAnchor>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <Reveal as="div" delay={60}>
                <Card className="h-full p-8 sm:p-9">
                  <h2 className="text-sm font-bold tracking-[0.16em] text-faint">사 업 장 정 보</h2>
                  <dl className="mt-6 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 text-base">
                    <dt className="font-bold text-muted">상호</dt>
                    <dd className="m-0 font-semibold text-navy">{site.name}</dd>
                    <dt className="font-bold text-muted">운영</dt>
                    <dd className="m-0 text-ink-2">{site.parent}</dd>
                    <dt className="font-bold text-muted">주소</dt>
                    <dd className="m-0 leading-[1.7] text-ink-2">{site.address}</dd>
                  </dl>
                </Card>
              </Reveal>

              <Reveal as="div" delay={120}>
                <Card className="h-full p-8 sm:p-9">
                  <h2 className="text-sm font-bold tracking-[0.16em] text-faint">접 수 후 진 행</h2>
                  <ol className="mt-6 flex flex-col gap-4">
                    {processSteps.map((step, i) => (
                      <li key={step.title} className="flex items-center gap-4">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-extrabold text-navy" data-numeric>
                          {i + 1}
                        </span>
                        <span className="text-base font-bold text-ink-2">{step.title}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </Reveal>

              <Reveal as="div" delay={180}>
                <Card className="h-full p-8 sm:p-9">
                  <h2 className="text-sm font-bold tracking-[0.16em] text-faint">찾 아 오 시 는 길</h2>
                  <p className="mt-6 text-base leading-[1.8] text-ink-2">{site.address}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <ButtonAnchor href={site.mapLinks.naver} target="_blank" rel="noreferrer" variant="ghost">
                      <Icon.pin className="size-4" />
                      네이버 지도
                    </ButtonAnchor>
                    <ButtonAnchor href={site.mapLinks.kakao} target="_blank" rel="noreferrer" variant="ghost">
                      <Icon.pin className="size-4" />
                      카카오맵
                    </ButtonAnchor>
                  </div>
                  {SAMPLE_CONTENT && (
                    <p className="mt-5 border-t border-line pt-4 text-[0.75rem] leading-[1.6] text-warn">
                      지도 임베드는 도메인 확정 후 API 키를 발급받아 이 자리에 넣습니다.
                    </p>
                  )}
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 자주 묻는 질문 (전체) ═══════════════ */}
      <Section tone="tint" id="faq">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="자 주 묻 는 질 문"
              title="문의 전에 확인하실 수 있는 것들"
              lede="더 궁금하신 점은 연락 주시면 상세히 설명해 드립니다."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-9">
              <FaqList />
            </div>
          </Reveal>
        </Container>
        <FaqJsonLd />
      </Section>

      <Section tone="white" className="!py-14">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-4 text-[0.9375rem] text-ink-2">
              <Icon.pin className="size-5 shrink-0 text-sky" />
              <span>
                <strong className="font-bold text-navy">{site.address}</strong> ·
                사업장 세탁물을 관리해 드립니다.
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
