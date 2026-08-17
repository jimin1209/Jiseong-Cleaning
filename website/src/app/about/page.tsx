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
  Section,
  SectionHead,
} from "@/components/ui";
import { site, targetIndustries } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "지성크리닝은 (주)지성이엔지가 운영하는 세탁 사업 부문이며 장애인 표준사업장으로 운영됩니다. 소재지와 연락처를 안내합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="회 사 소 개"
        title="제조 법인이 운영하는 세탁 사업 부문입니다"
        lede="지성크리닝은 도로 안전 장비를 제조하는 (주)지성이엔지의 세탁 사업 부문입니다. 계약과 정산이 법인 기준으로 처리되고, 설비와 공장을 직접 운영합니다."
      />

      {/* ═══════════════ 개요 ═══════════════ */}
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
            <Reveal>
              <SectionHead
                eyebrow="사 업 개 요"
                title="사업장 린넨 관리를 대신 맡습니다"
              />
              <div className="mt-6 flex flex-col gap-4 text-[0.9375rem] leading-[1.85] text-ink-2">
                <p>
                  호텔·모텔·펜션의 침구와 수건, 식당·급식소의 행주와 유니폼처럼
                  사업장에서 반복적으로 발생하는 세탁물을 대량으로 수거해
                  세탁하고 납품합니다. 개인 고객의 옷은 취급하지 않습니다.
                </p>
                <p>
                  사업장이 세탁업체를 바꾸는 이유는 대개 가격이 아니라 수거가
                  밀려서입니다. 그래서 지성크리닝은 수거 요일과 납품 요일을
                  고정하고 그 주기를 지키는 것을 첫 번째 기준으로 둡니다.
                </p>
                <p>
                  세탁물은 외부에 재위탁하지 않고 경주 천북면 자사 시설에서
                  직접 처리합니다. 입고부터 납품까지 한 곳에서 이뤄지기 때문에
                  수량이나 상태에 문제가 생겼을 때 어느 단계였는지 추적할 수
                  있습니다.
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

                  <dt className="text-[0.8125rem] font-bold text-muted">소재지</dt>
                  <dd className="m-0 text-ink-2">{site.address}</dd>

                  <dt className="text-[0.8125rem] font-bold text-muted">대표전화</dt>
                  <dd className="m-0">
                    <a href={site.telHref} className="font-bold text-brand" data-numeric>
                      {site.tel}
                    </a>
                  </dd>

                  <dt className="text-[0.8125rem] font-bold text-muted">취급</dt>
                  <dd className="m-0 text-ink-2">
                    숙박 린넨 · 주방 리넨 · 월세탁 정기 계약
                  </dd>
                </dl>

                <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-[1.7] text-muted">
                  모회사 홈페이지{" "}
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
              <p className="mt-5 max-w-[44em] text-[0.9375rem] leading-[1.85] text-[#A6C5E8]">
                다만 이것이 세탁 품질이나 납기의 예외 사유가 되지는 않습니다.
                검수 기준과 수거·납품 일정은 일반 사업장과 동일하게 관리합니다.
                거래처가 지성크리닝을 선택하는 이유가 배려가 아니라 실제 성능이어야
                지속될 수 있다고 보기 때문입니다.
              </p>
            </Reveal>

            <Reveal delay={100} className="shrink-0">
              <div className="inline-flex items-center gap-3.5 rounded-brand bg-white/10 px-6 py-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                <Icon.seal className="size-8 shrink-0 text-[#6FD6FF]" />
                <span>
                  <strong className="block text-[1.0625rem] font-extrabold tracking-[-0.02em] text-white">
                    장애인 표준사업장
                  </strong>
                  <span className="mt-0.5 block text-[0.8125rem] text-[#A6C5E8]">
                    인증기관 · 인증번호 확인 후 표기
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
              title="사업장 고객만 거래합니다"
              lede="가정(아파트 · 빌라) 세탁물은 취급하지 않습니다. 대량 처리와 정기 수거에 맞춰 설비와 일정을 운영하고 있기 때문입니다."
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
              수거·납품 가능 권역은 경주 인근을 기준으로 운영합니다. 사업장 지역을
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
