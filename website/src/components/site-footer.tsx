import Link from "next/link";
import { BrandLockup } from "./brand-mark";
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
              대표전화{" "}
              <a href={site.telHref} className="text-pale hover:text-white" data-numeric>
                {site.tel}
              </a>
            </address>
            <p className="mt-3 leading-[1.85]">
              지성크리닝은{" "}
              <a
                href={site.parentUrl}
                className="text-pale hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                {site.parent}
              </a>
              가 운영하는 세탁 서비스입니다.
            </p>
          </div>

          <nav className="min-w-36 shrink-0" aria-label="서비스">
            <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-[#6E8CB4]">
              서 비 스
            </h2>
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-[0.9375rem] text-[#C3D6EC] hover:text-white"
                  >
                    {s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="min-w-36 shrink-0" aria-label="안내">
            <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-[#6E8CB4]">
              안 내
            </h2>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/facility", label: "시설 · 공정" },
                { href: "/about", label: "회사소개" },
                { href: "/about#standard-workplace", label: "장애인 표준사업장" },
                { href: "/quote", label: "견적 문의" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.9375rem] text-[#C3D6EC] hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 사업자 정보 — 법적 지위(사업부/별도 사업자) 확정 전이라 임시값 */}
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-6 text-[0.8125rem] text-[#8AA4C6]">
          {businessInfo.representative && (
            <span>대표자 {businessInfo.representative}</span>
          )}
          {businessInfo.registrationNumber && (
            <span data-numeric>
              사업자등록번호 {businessInfo.registrationNumber}
            </span>
          )}
          {businessInfo.mailOrderNumber && (
            <span data-numeric>
              통신판매업 {businessInfo.mailOrderNumber}
            </span>
          )}
          {businessInfo.fax && <span data-numeric>팩스 {businessInfo.fax}</span>}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-3 text-[0.8125rem] text-[#6E8CB4]">
          <span>© {new Date().getFullYear()} 지성크리닝 · {site.parent}</span>
          {SAMPLE_CONTENT && (
            <span className="text-[#C08A4A]">
              사업자 정보는 확인 전 임시값입니다
            </span>
          )}
        </div>
      </Container>
    </footer>
  );
}
