"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * 스크롤 등장.
 *
 * 애니메이션 라이브러리를 넣지 않은 이유: 이 사이트에 필요한 모션은
 * 「화면에 들어오면 한 번 올라온다」 하나뿐이고, 그건 IntersectionObserver
 * 12줄로 끝난다. 번들에 50KB를 더할 이유가 없다.
 *
 * 실제 전환은 globals.css 의 [data-reveal] 이 담당하며,
 * prefers-reduced-motion 에서는 CSS가 즉시 표시로 덮는다.
 */
export function Reveal({
  children,
  as: As = "div" as ElementType,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** 밀리초. 목록에서 순차 등장시킬 때 index * 60 정도가 자연스럽다 */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 관찰 전에 이미 화면 안이면 바로 보여준다(새로고침·앵커 진입)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </As>
  );
}
