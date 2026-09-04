import type { Metadata } from "next";
import { ContactAction, DeviceSplit } from "@/components/contact-action";
import { TelAnchor, TelMobileAnchor } from "@/components/contact-links";
import { T } from "@/components/copy-text";
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
        eyebrow={<T k="about.hero.eyebrow" />}
        title={<T k="about.hero.title" />}
        lede={<T k="about.hero.lede" />}
      />

      {/* ═══════════════ 개요 ═══════════════ */}
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
            <Reveal>
              <SectionHead
                eyebrow={<T k="about.overview.eyebrow" />}
                title={<T k="about.overview.title" />}
              />
              <div className="mt-6 flex flex-col gap-4 text-[0.9375rem] leading-[1.85] text-ink-2">
                <p>
                  <T k="about.overview.p1" />
                </p>
                <p>
                  <T k="about.overview.p2" />
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <Card className="p-7">
                <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
                  <T k="about.info.heading" />
                </h2>
                <dl className="mt-5 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3.5 text-[0.9375rem]">
                  <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.name" /></dt>
                  <dd className="m-0 text-ink-2">
                    <T k="brand.name" />
                  </dd>

                  <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.operator" /></dt>
                  <dd className="m-0 text-ink-2">
                    <T k="brand.parent" />
                  </dd>

                  {businessInfo.representative && (
                    <>
                      <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.representative" /></dt>
                      <dd className="m-0 text-ink-2">
                        <T k="biz.representative" />
                      </dd>
                    </>
                  )}

                  {businessInfo.registrationNumber && (
                    <>
                      <dt className="text-[0.8125rem] font-bold text-muted">
                        <T k="about.info.registration" />
                      </dt>
                      <dd className="m-0 text-ink-2" data-numeric>
                        <T k="biz.registration" />
                      </dd>
                    </>
                  )}

                  <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.address" /></dt>
                  <dd className="m-0 text-ink-2">
                    <T k="site.address" />
                  </dd>

                  <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.tel" /></dt>
                  <dd className="m-0">
                    {/* PC 에선 죽은 tel: 링크가 되므로 표기만, 모바일만 발신 (명세 9-3·9-4) */}
                    <DeviceSplit
                      pc={
                        <span className="font-bold text-brand" data-numeric>
                          <T k="site.tel" />
                        </span>
                      }
                      mobile={
                        <TelAnchor className="font-bold text-brand" data-numeric>
                          <T k="site.tel" />
                        </TelAnchor>
                      }
                    />
                  </dd>

                  <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.telMobile" /></dt>
                  <dd className="m-0">
                    {/* 대표전화와 같은 규칙 — PC 는 표기만, 모바일만 발신 (명세 9-3·9-4) */}
                    <DeviceSplit
                      pc={
                        <span className="font-bold text-brand" data-numeric>
                          <T k="site.telMobile" />
                        </span>
                      }
                      mobile={
                        <TelMobileAnchor className="font-bold text-brand" data-numeric>
                          <T k="site.telMobile" />
                        </TelMobileAnchor>
                      }
                    />
                  </dd>

                  {businessInfo.fax && (
                    <>
                      <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.fax" /></dt>
                      <dd className="m-0 text-ink-2" data-numeric>
                        <T k="biz.fax" />
                      </dd>
                    </>
                  )}

                  <dt className="text-[0.8125rem] font-bold text-muted"><T k="about.info.handlingLabel" /></dt>
                  <dd className="m-0 text-ink-2">
                    <T k="about.info.handling" />
                  </dd>
                </dl>

                {SAMPLE_CONTENT && (
                  <p className="mt-4 rounded-brand bg-warn-bg px-3.5 py-2.5 text-[0.75rem] leading-[1.6] font-semibold text-warn">
                    <T k="about.info.sampleNotice" />
                  </p>
                )}

                <p className="mt-5 border-t border-line pt-5 text-[0.8125rem] leading-[1.8] text-muted">
                  <T k="about.info.parentHq" />
                  <br />
                  <T k="site.parentAddress" />
                  <br />
                  <a
                    href={site.parentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand"
                  >
                    <T k="about.info.parentSite" />
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
                eyebrow={<T k="about.social.eyebrow" />}
                title={<T k="about.social.title" />}
                lede={<T k="about.social.lede" />}
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
                    <T k="about.social.badgeTitle" />
                  </strong>
                  {/* 인증번호는 표기하지 않는다 — 회의 결정(인증 사실만 표기) */}
                  <span className="mt-0.5 block text-[0.8125rem] text-[#A6C5E8]">
                    <T k="about.social.badgeSub" />
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
              eyebrow={<T k="about.clients.eyebrow" />}
              title={<T k="about.clients.title" />}
              lede={<T k="about.clients.lede" />}
            />
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {targetIndustries.map((t, i) => {
                const Glyph = Icon[t.icon];
                return (
                  <li
                    key={t.label}
                    className="inline-flex items-center gap-2.5 rounded-brand border border-line bg-paper px-5 py-3.5 text-[0.9375rem] font-bold text-navy"
                  >
                    <Glyph className="size-[1.1875rem] shrink-0 text-sky" />
                    <T k={`industries.${i}.label`} />
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <Alert tone="warn" className="mt-8 max-w-3xl">
              <T k="about.clients.alert" />
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
                  title={<T k="about.cta.title" />}
                  lede={<T k="about.cta.lede" />}
                  className="flex-1 basis-[22rem]"
                />
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/quote" size="lg">
                    <T k="about.cta.quoteCta" />
                    <Icon.arrowRight className="size-4" />
                  </ButtonLink>
                  <ContactAction kind="tel" variant="ghost" size="lg">
                    <Icon.phone className="size-[1.0625rem]" />
                    <span data-numeric>
                      <T k="site.tel" />
                    </span>
                  </ContactAction>
                  {/* 휴대전화 — 대표전화와 나란히 두고, 각 버튼은 자기 번호로 건다 */}
                  <ContactAction kind="telMobile" variant="ghost" size="lg">
                    <Icon.smartphone className="size-[1.0625rem]" />
                    <span data-numeric>
                      <T k="site.telMobile" />
                    </span>
                  </ContactAction>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* 파트너 문구 — 페이지 끝에 1회만 쓴다. 다른 곳에 반복하지 않는다 */}
          <Reveal delay={80}>
            <p className="mt-10 text-center text-[0.9375rem] leading-[1.8] text-ink-2">
              <T k="about.partner.quote" />
              <br />
              <strong className="font-bold text-navy">
                <T k="about.partner.line" />
              </strong>
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
