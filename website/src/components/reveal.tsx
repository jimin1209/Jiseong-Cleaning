"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * 스크롤 등장.
 *
 * ⚠️ 설계 원칙: **JS 가 숨기고, JS 가 되살린다.**
 *
 * 서버가 보내는 HTML 에는 data-reveal 이 없어서 콘텐츠가 처음부터 보인다.
 * 아래 effect 가 실행돼야만 숨겨지고, 같은 effect 가 관찰자를 붙여 되살린다.
 * 그래서 스크립트가 차단되거나 하이드레이션이 실패해도 화면이 비지 않는다.
 *
 * (반대로 CSS 로 미리 opacity:0 을 걸어두면 청크 하나가 403 나는 순간
 *  사이트 전체가 백지가 된다. dev 서버를 외부 IP 로 열었을 때 실제로 그랬다.)
 *
 * 애니메이션 라이브러리를 쓰지 않은 이유는 필요한 동작이
 * 「화면에 들어오면 한 번 올라온다」 하나뿐이어서다.
 */
export function Reveal({
  children,
  as: As = "div" as ElementType,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** 밀리초. 목록에서 순차 등장시킬 때 index * 70 정도가 자연스럽다 */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 모션을 끈 사용자에게는 아무것도 하지 않는다 (숨기지도 않는다)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 이미 화면 안이면 그대로 둔다 — 첫 화면 콘텐츠가 사라졌다 나타나면 오히려 어색하다
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    // 전환 없이 먼저 숨긴 뒤(init), 다음 프레임에 전환을 켠다
    el.setAttribute("data-reveal", "init");
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);

    const armed = requestAnimationFrame(() => {
      el.setAttribute("data-reveal", "");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(el);

    return () => {
      cancelAnimationFrame(armed);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <As ref={ref} className={className}>
      {children}
    </As>
  );
}
