import Link from "next/link";
import { BrandLockup } from "./brand-mark";
import { T } from "./copy-text";
import { ContactSplitLink } from "./contact-action";
import { SnsButtons } from "./sns-buttons";
import { Container } from "./ui";
import { businessInfo, SAMPLE_CONTENT } from "@/lib/sample";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep pt-14 pb-8 text-sm text-[#9FB6D4]">
      <Container>
        <div className="flex flex-wrap gap-10 border-b border-white/12 pb-9 lg:gap-16">
          <div className="min-w-0 flex-1 basis-72">
            <BrandLockup tone="dark" showParent={false} className="mb-4" />
            <address className="not-italic leading-[1.85]">
              {site.address}
              <br />
              <T k="footer.telLabel" />{" "}
              {/* 기기별 분기 — PC 는 /quote, 모바일은 즉시 발신 (명세 9-3·9-4) */}
              <ContactSplitLink kind="tel" className="text-pale hover:text-white">
                <span data-numeric>{site.tel}</span>
              </ContactSplitLink>
            </address>
            <p className="mt-3 leading-[1.85]">
              <T k="footer.operator.pre" />{" "}
              <a
                href={site.parentUrl}
                className="text-pale hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                <T k="footer.operator.parent" />
              </a>
              <T k="footer.operator.post" />
            </p>
            {/* SNS — 계정 개설 전이라 누르면 "준비 중" 안내가 뜬다 (명세 9-6) */}
            <SnsButtons tone="dark" className="mt-4 -ml-2" />
          </div>

          <nav className="min-w-36 shrink-0" aria-label="서비스">
            <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-[#6E8CB4]">
              <T k="footer.services.heading" />
            </h2>
            {/* 서비스가 한 건으로 통합돼 링크도 /services 하나만 둔다 */}
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href="/services"
                    className="text-[0.9375rem] text-[#C3D6EC] hover:text-white"
                  >
                    <T k={`service.${s.slug}.short`} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="min-w-36 shrink-0" aria-label="안내">
            <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-[#6E8CB4]">
              <T k="footer.info.heading" />
            </h2>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/about", k: "footer.info.0" },
                { href: "/about#standard-workplace", k: "footer.info.1" },
                { href: "/quote", k: "footer.info.2" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.9375rem] text-[#C3D6EC] hover:text-white"
                  >
                    <T k={l.k} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 사업자 정보 — 법적 지위(사업부/별도 사업자) 확정 전이라 임시값 */}
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-6 text-[0.8125rem] text-[#8AA4C6]">
          {businessInfo.representative && (
            <span><T k="footer.biz.representative" /> {businessInfo.representative}</span>
          )}
          {businessInfo.registrationNumber && (
            <span data-numeric>
              <T k="footer.biz.registration" /> {businessInfo.registrationNumber}
            </span>
          )}
          {businessInfo.mailOrderNumber && (
            <span data-numeric>
              <T k="footer.biz.mailOrder" /> {businessInfo.mailOrderNumber}
            </span>
          )}
          {businessInfo.fax && (
            <span data-numeric>
              <T k="footer.biz.fax" /> {businessInfo.fax}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-3 text-[0.8125rem] text-[#6E8CB4]">
          <span>© {new Date().getFullYear()} <T k="footer.copyright" /></span>
          {SAMPLE_CONTENT && (
            <span className="text-[#C08A4A]">
              <T k="footer.sampleNotice" />
            </span>
          )}
        </div>
      </Container>
    </footer>
  );
}
