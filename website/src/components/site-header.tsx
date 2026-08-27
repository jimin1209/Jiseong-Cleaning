"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "./brand-mark";
import { ContactSplitLink } from "./contact-action";
import { Icon } from "./icons";
import { ButtonLink, Container } from "./ui";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Esc 로도 닫힌다 — 열린 메뉴가 화면을 덮으므로 탈출 경로가 있어야 한다
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // 진행 바는 스크롤마다 움직이므로 리렌더 대신 스타일을 직접 쓴다
      const bar = progressRef.current;
      if (bar) {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        bar.style.width =
          max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 메뉴가 열린 동안 배경 스크롤을 막는다
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md backdrop-saturate-150 transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_var(--color-line),0_4px_16px_-8px_rgb(20_48_110/0.16)]" : "shadow-[0_1px_0_var(--color-line)]"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center gap-6 lg:h-[4.75rem]">
          <Link
            href="/"
            className="shrink-0 rounded-brand"
            aria-label={`${site.name} 홈`}
          >
            <BrandLockup />
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="주 메뉴">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-brand px-3.5 py-2 text-[0.9375rem] font-semibold transition-colors duration-150 ${
                  isActive(item.href)
                    ? "bg-tint text-navy"
                    : "text-ink-2 hover:bg-tint hover:text-navy"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            {/* 전화 영역 기기별 분기 — PC 는 /quote, 태블릿 이하는 즉시 발신 (명세 9-3·9-4) */}
            <ContactSplitLink
              kind="tel"
              className="rounded-brand leading-tight"
              pcClassName="block"
              mobileClassName="hidden md:block"
            >
              <span className="block text-[0.65rem] font-bold tracking-[0.1em] text-muted">
                전화 문의
              </span>
              <span
                className="block text-[1.1875rem] font-extrabold tracking-[-0.02em] text-navy"
                data-numeric
              >
                {site.tel}
              </span>
            </ContactSplitLink>

            <ButtonLink href="/quote" size="sm" className="hidden lg:inline-flex">
              견적 문의
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              className="rounded-brand p-2 text-navy lg:hidden"
            >
              {open ? <Icon.close className="size-6" /> : <Icon.menu className="size-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* 스크롤 진행 바 — 헤더 그림자 선 바로 아래, 읽은 만큼 CI 그라디언트로 채워진다 */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-r-sm bg-[linear-gradient(90deg,var(--color-ci-deep),var(--color-ci-cyan))]"
      />

      {/* 모바일 메뉴 */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-white lg:hidden"
      >
        <Container>
          <nav className="py-2" aria-label="모바일 메뉴">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block border-b border-line py-3.5 text-base font-semibold last:border-b-0 ${
                      isActive(item.href) ? "text-brand" : "text-ink-2"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
