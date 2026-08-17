import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { Reveal } from "@/components/reveal";
import { Alert, Card, Container, Section } from "@/components/ui";
import { processSteps } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "견적 · 상담 문의",
  description:
    "업체명과 품목, 주당 물량만 알려주시면 영업일 기준 1일 이내에 견적을 드립니다. 전화 054-621-5002.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="견 적 · 상 담 문 의"
        title="물량과 주기만 알려주시면 바로 견적을 드립니다"
        lede="영업일 기준 1일 이내에 담당자가 연락드립니다. 급하시면 전화가 가장 빠릅니다."
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
                  상 담 및 견 적 문 의
                </p>
                <a
                  href={site.telHref}
                  className="mt-2 block text-[2rem] font-extrabold tracking-[-0.03em] text-white"
                  data-numeric
                >
                  {site.tel}
                </a>
                <p className="mt-3.5 text-sm leading-[1.7] text-[#A6C5E8]">
                  {/* 운영시간은 확정 전이라 단정하지 않는다 */}
                  통화가 어려운 시간에는 아래 폼으로 남겨주시면 회신드립니다.
                </p>
              </div>

              <Card className="p-6">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  사 업 장 정 보
                </h2>
                <dl className="mt-4 grid grid-cols-[4rem_minmax(0,1fr)] gap-x-3.5 gap-y-3 text-[0.875rem]">
                  <dt className="text-[0.78rem] font-bold text-muted">상호</dt>
                  <dd className="m-0 text-ink-2">{site.name}</dd>
                  <dt className="text-[0.78rem] font-bold text-muted">운영</dt>
                  <dd className="m-0 text-ink-2">{site.parent}</dd>
                  <dt className="text-[0.78rem] font-bold text-muted">주소</dt>
                  <dd className="m-0 text-ink-2">{site.address}</dd>
                </dl>
              </Card>

              <Card className="p-6">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  접 수 후 진 행
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
                        {step.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>

              {/* 지도는 도메인·API 키 확정 후 붙인다 */}
              <Alert tone="warn">
                <strong className="block">지도 영역</strong>
                네이버 지도 또는 카카오맵 임베드 예정. 도메인 확정 후 API 키 발급이
                필요합니다.
              </Alert>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="tint" className="!py-14">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-4 text-[0.9375rem] text-ink-2">
              <Icon.pin className="size-5 shrink-0 text-sky" />
              <span>
                <strong className="font-bold text-navy">{site.address}</strong> ·
                가정(아파트 · 빌라) 세탁물은 취급하지 않으며 사업장 고객만 거래합니다.
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
