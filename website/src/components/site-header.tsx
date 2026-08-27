"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLockup } from "./brand-mark";
import { Icon } from "./icons";
import { ButtonLink, Container } from "./ui";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 페이지 전환이 끝난 뒤 최상단을 다시 확정해 브라우저의 스크롤 복원을 덮는다.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  // 메뉴가 열린 동안 배경 스크롤을 막는다
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleMenuClick = () => {
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

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
            scroll
            onClick={handleMenuClick}
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
                scroll
                onClick={handleMenuClick}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-brand px-3.5 py-2 text-[0.9375rem] font-semibold transition-all duration-150 ${
                  isActive(item.href)
                    ? "translate-y-px bg-navy text-white shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]"
                    : "bg-transparent text-ink-2 hover:bg-tint hover:text-navy"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <a
              href={site.telHref}
              className="hidden rounded-brand leading-tight md:block"
            >
              <span className="block text-[0.65rem] font-bold tracking-[0.1em] text-muted">
                상담 및 견적 문의
              </span>
              <span
                className="block text-[1.1875rem] font-extrabold tracking-[-0.02em] text-navy"
                data-numeric
              >
                {site.tel}
              </span>
            </a>

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
                    scroll
                    onClick={handleMenuClick}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block border-b border-line px-3 py-3.5 text-base font-semibold last:border-b-0 ${
                      isActive(item.href)
                        ? "rounded-brand bg-navy text-white shadow-[inset_0_2px_4px_rgb(0_0_0/0.2)]"
                        : "bg-transparent text-ink-2"
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
