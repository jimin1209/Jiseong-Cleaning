import type { Metadata } from "next";
import { ContactAction } from "@/components/contact-action";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  Alert,
  ButtonLink,
  Card,
  Container,
  Section,
  SectionHead,
} from "@/components/ui";
import { businessInfo, SAMPLE_CONTENT } from "@/lib/sample";
import { site, targetIndustries } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "지성크리닝은 우수조달업체 (주)지성이엔지에서 운영하는 세탁 사업 부문이며 장애인 표준사업장으로 운영됩니다. 소재지와 연락처를 안내합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="회 사 소 개"
        title="(주)지성이엔지 지성크리닝"
        lede="우수조달업체 (주)지성이엔지에서 운영하는 세탁 사업 부문입니다."
      />

      {/* ═══════════════ 개요 ═══════════════ */}
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
            <Reveal>
              <SectionHead
                eyebrow="사 업 개 요"
                title="사업장 세탁물을 관리해 드리겠습니다."
              />
              <div className="mt-6 flex flex-col gap-4 text-[0.9375rem] leading-[1.85] text-ink-2">
                <p>
                  사업장에서 반복적으로 발생하는 세탁물을 대량으로 수거해
                  세탁하고 배송합니다. 세탁물이 제때 돌아오도록 약속한 날짜에
                  맞춰 정기적으로 수거하고 배송합니다.
                </p>
                <p>
                  세탁은 자체 세탁 시설에서 전문 세탁 장비로 처리합니다.
                  품목과 물량, 수거 주기는 사업장 사정에 맞춰 상담해 정합니다.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <Card className="p-7">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  사 업 자 정 보
                </h2>
                <dl className="mt-5 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3.5 text-[0.9375rem]">
                  <dt className="text-[0.8125rem] font-bold text-muted">상호</dt>
                  <dd className="m-0 text-ink-2">{site.name}</dd>

                  <dt className="text-[0.8125rem] font-bold text-muted">운영</dt>
                  <dd className="m-0 text-ink-2">{site.parent}</dd>

                  {businessInfo.representative && (
                    <>
                      <dt className="text-[0.8125rem] font-bold text-muted">대표자</dt>
                      <dd className="m-0 text-ink-2">{businessInfo.representative}</dd>
                    </>
                  )}

                  {businessInfo.registrationNumber && (
                    <>
                      <dt className="text-[0.8125rem] font-bold text-muted">
                        사업자번호
                      </dt>
                      <dd className="m-0 text-ink-2" data-numeric>
                        {businessInfo.registrationNumber}
                      </dd>
                    </>
                  )}

                  <dt className="text-[0.8125rem] font-bold text-muted">소재지</dt>
                  <dd className="m-0 text-ink-2">{site.address}</dd>

                  <dt className="text-[0.8125rem] font-bold text-muted">대표전화</dt>
                  <dd className="m-0">
                    <a href={site.telHref} className="font-bold text-brand" data-numeric>
                      {site.tel}
                    </a>
                  </dd>

                  {businessInfo.fax && (
                    <>
                      <dt className="text-[0.8125rem] font-bold text-muted">팩스</dt>
                      <dd className="m-0 text-ink-2" data-numeric>
                        {businessInfo.fax}
                      </dd>
                    </>
                  )}

                  <dt className="text-[0.8125rem] font-bold text-muted">취급</dt>
                  <dd className="m-0 text-ink-2">
                    사업장 세탁물 정기 수거 · 세탁 · 배송
                  </dd>
                </dl>

                {SAMPLE_CONTENT && (
                  <p className="mt-4 rounded-brand bg-warn-bg px-3.5 py-2.5 text-[0.75rem] leading-[1.6] font-semibold text-warn">
                    대표자 · 사업자번호 · 팩스는 확인 전 임시값입니다.
                  </p>
                )}

                <p className="mt-5 border-t border-line pt-5 text-[0.8125rem] leading-[1.8] text-muted">
                  모회사 본사
                  <br />
                  {site.parentAddress}
                  <br />
                  <a
                    href={site.parentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand"
                  >
                    jiseong.co.kr
                  </a>
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 장애인 표준사업장 ═══════════════ */}
      <Section tone="navy" id="standard-workplace">
        <Container>
          <div className="flex flex-wrap items-start gap-8 lg:gap-14">
            <Reveal className="min-w-0 flex-1 basis-[26rem]">
              <SectionHead
                tone="dark"
                eyebrow="사 회 적 가 치"
                title="장애인 표준사업장으로 운영합니다"
                lede="지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다."
              />
              {/*
                전단지에 인쇄된 문장(위 lede)만 쓴다.
                회사의 입장이나 방침을 덧붙이지 않는다 — 대표·팀장이 정할 영역이다.
              */}
            </Reveal>

            <Reveal delay={100} className="shrink-0">
              <div className="inline-flex items-center gap-3.5 rounded-brand bg-white/10 px-6 py-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                <Icon.seal className="size-8 shrink-0 text-[#6FD6FF]" />
                <span>
                  <strong className="block text-[1.0625rem] font-extrabold tracking-[-0.02em] text-white">
                    장애인 표준사업장
                  </strong>
                  {/* 인증번호는 표기하지 않는다 — 회의 결정(인증 사실만 표기) */}
                  <span className="mt-0.5 block text-[0.8125rem] text-[#A6C5E8]">
                    장애인 표준사업장 인증
                  </span>
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ═══════════════ 거래 대상 ═══════════════ */}
      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="거 래 대 상"
              title="사업장 고객과 거래합니다"
              lede="대량 처리와 정기 수거에 맞춰 설비와 일정을 운영하고 있습니다."
            />
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {targetIndustries.map((t) => {
                const Glyph = Icon[t.icon];
                return (
                  <li
                    key={t.label}
                    className="inline-flex items-center gap-2.5 rounded-brand border border-line bg-paper px-5 py-3.5 text-[0.9375rem] font-bold text-navy"
                  >
                    <Glyph className="size-[1.1875rem] shrink-0 text-sky" />
                    {t.label}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <Alert tone="warn" className="mt-8 max-w-3xl">
              수거·배송 가능 권역은 경주 인근을 기준으로 운영합니다. 사업장 지역을
              알려주시면 가능 여부를 확인해 드립니다.
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
                  title="거래를 검토 중이시면 연락 주세요"
                  lede="품목과 물량, 희망 주기를 알려주시면 조건을 정리해 드립니다."
                  className="flex-1 basis-[22rem]"
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
            </Card>
          </Reveal>

          {/* 파트너 문구 — 페이지 끝에 1회만 쓴다. 다른 곳에 반복하지 않는다 */}
          <Reveal delay={80}>
            <p className="mt-10 text-center text-[0.9375rem] leading-[1.8] text-ink-2">
              &lsquo;안전한 시공 및 점검으로 신뢰받는 기업&rsquo;
              <br />
              <strong className="font-bold text-navy">
                (주)지성이엔지의 파트너 지성크리닝입니다.
              </strong>
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
