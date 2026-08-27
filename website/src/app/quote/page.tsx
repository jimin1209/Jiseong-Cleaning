import type { Metadata } from "next";
import { DeviceSplit } from "@/components/contact-action";
import { T } from "@/components/copy-text";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { ReviewMarquee } from "@/components/review-marquee";
import { Reveal } from "@/components/reveal";
import { SnsButtons } from "@/components/sns-buttons";
import { ButtonAnchor, Card, Container, Section, SectionHead } from "@/components/ui";
import { reviews, SAMPLE_CONTENT } from "@/lib/sample";
import { processSteps } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "견적 · 상담 문의",
  description: `업체명과 연락처를 남겨주시면 담당자가 확인 후 연락드립니다. 전화 ${site.tel}.`,
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow={<T k="quote.hero.eyebrow" />}
        title={<T k="quote.hero.title" />}
      />

      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
            {/* 폼 */}
            <Reveal>
              <QuoteForm />
            </Reveal>

            {/* 연락 정보 */}
            <Reveal delay={100} className="flex flex-col gap-4">
              <div className="rounded-brand bg-navy px-6 py-7 text-white">
                <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-pale">
                  <T k="quote.telCard.heading" />
                </p>
                {/* 기기별 분기(명세 9-3·9-4) — 이미 견적 페이지라 PC 는 링크 없이 번호만 보여준다 */}
                <DeviceSplit
                  pc={
                    <span
                      className="mt-2 block text-[2rem] font-extrabold tracking-[-0.03em] text-white"
                      data-numeric
                    >
                      {site.tel}
                    </span>
                  }
                  mobile={
                    <a
                      href={site.telHref}
                      className="mt-2 block text-[2rem] font-extrabold tracking-[-0.03em] text-white"
                      data-numeric
                    >
                      {site.tel}
                    </a>
                  }
                />
                {/* 운영시간은 실값 확정 전 — 임시값 노출 대신 폼 안내로 단순화 */}
                <p className="mt-3.5 text-sm leading-[1.7] text-[#A6C5E8]">
                  <T k="quote.telCard.note" />
                </p>
              </div>

              <Card className="p-6">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  <T k="quote.bizCard.heading" />
                </h2>
                <dl className="mt-4 grid grid-cols-[4rem_minmax(0,1fr)] gap-x-3.5 gap-y-3 text-[0.875rem]">
                  <dt className="text-[0.78rem] font-bold text-muted"><T k="quote.bizCard.name" /></dt>
                  <dd className="m-0 text-ink-2">{site.name}</dd>
                  <dt className="text-[0.78rem] font-bold text-muted"><T k="quote.bizCard.operator" /></dt>
                  <dd className="m-0 text-ink-2">{site.parent}</dd>
                  <dt className="text-[0.78rem] font-bold text-muted"><T k="quote.bizCard.address" /></dt>
                  <dd className="m-0 text-ink-2">{site.address}</dd>
                </dl>
              </Card>

              <Card className="p-6">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  <T k="quote.stepsCard.heading" />
                </h2>
                <ol className="mt-4 flex flex-col gap-3">
                  {processSteps.map((step, i) => (
                    <li key={step.title} className="flex items-center gap-3">
                      <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-tint text-[0.6875rem] font-extrabold text-navy"
                        data-numeric
                      >
                        {i + 1}
                      </span>
                      <span className="text-[0.875rem] font-semibold text-ink-2">
                        <T k={`process.${i}.title`} />
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>

              {/* 임베드 지도는 API 키가 필요하므로, 키 없이 되는 길찾기 링크를 먼저 붙였다 */}
              <Card className="p-6">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  <T k="quote.mapCard.heading" />
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-2">
                  {site.address}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonAnchor
                    href={site.mapLinks.naver}
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    size="sm"
                  >
                    <Icon.pin className="size-4" />
                    <T k="quote.mapCard.naver" />
                  </ButtonAnchor>
                  <ButtonAnchor
                    href={site.mapLinks.kakao}
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    size="sm"
                  >
                    <Icon.pin className="size-4" />
                    <T k="quote.mapCard.kakao" />
                  </ButtonAnchor>
                </div>
                {/* 내부 안내이므로 샘플 모드에서만 보인다 */}
                {SAMPLE_CONTENT && (
                  <p className="mt-4 border-t border-line pt-3.5 text-[0.75rem] leading-[1.6] text-warn">
                    <T k="quote.mapCard.notice" />
                  </p>
                )}
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 이용 후기 ═══════════════ */}
      {/* 폼 아래 마퀴(명세 4-3·9-1) — 문구는 회사 초안 수령 전 더미라 sample.ts 가 끄면 섹션째 빠진다 */}
      {reviews && (
        <Section tone="tint" className="!py-14 sm:!py-16">
          <Container>
            <Reveal>
              <SectionHead
                eyebrow={<T k="quote.reviews.eyebrow" />}
                title={<T k="quote.reviews.title" />}
              />
            </Reveal>
          </Container>
          <div className="mt-9">
            <ReviewMarquee />
          </div>
          {/* SNS 버튼은 후기 부근에도 둔다 (명세 9-6) */}
          <Container className="mt-7">
            <SnsButtons className="-ml-2" />
          </Container>
        </Section>
      )}

      <Section tone="white" className="!py-14">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-4 text-[0.9375rem] text-ink-2">
              <Icon.pin className="size-5 shrink-0 text-sky" />
              <span>
                <strong className="font-bold text-navy">{site.address}</strong>
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
