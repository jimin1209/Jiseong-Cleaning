"use client";

import { useEffect, useMemo, useRef } from "react";
import { T, useCopy } from "./copy-text";

/**
 * 히어로 로테이팅 키워드 (디자인 보강 D5).
 *
 * 같은 그리드 칸에 겹쳐 둔 단어들을 2.6초마다 교차 페이드로 순환한다.
 * 컨테이너 폭은 현재 단어를 따라가므로 긴 단어 기준의 구멍이 생기지 않는다.
 *
 * 단어는 copy.ts 경로 키(wordKeys)로 받는다 — 편집 모드 오버라이드가
 * 적용되면 순환을 다시 초기화한다. 렌더 결과는 문자열 배열이던 때와 같다.
 *
 * 접근성·견고함:
 * - 스크린리더에는 기본형(wordKeys[0]) 하나만 읽힌다 — 순환 스택은 aria-hidden.
 * - 서버 HTML 은 기본형이 보이는 상태로 나가므로 JS 가 막혀도 문장이 완성된다.
 * - 모션을 끈 사용자에게는 순환을 시작하지 않는다 (기본형 고정).
 */
export function RotatingWords({ wordKeys }: { wordKeys: readonly string[] }) {
  const stackRef = useRef<HTMLSpanElement>(null);
  const { get } = useCopy();
  const words = useMemo(() => wordKeys.map((k) => get(k)), [wordKeys, get]);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ease = "cubic-bezier(0.2, 0, 0.2, 1)";
    const items = Array.from(stack.children) as HTMLSpanElement[];
    let index = 0;

    // 컨테이너 폭을 현재 단어 폭에 맞춘다 — 측정 동안만 transform 을 벗긴다
    const fit = () => {
      const word = items[index];
      const prevTransform = word.style.transform;
      const prevTransition = word.style.transition;
      word.style.transition = "none";
      word.style.transform = "none";
      stack.style.width = `${Math.ceil(word.getBoundingClientRect().width)}px`;
      word.style.transform = prevTransform;
      word.style.transition = prevTransition;
    };

    items.forEach((word, i) => {
      word.style.transition = `opacity 0.5s ${ease}, transform 0.5s ${ease}`;
      if (i) {
        word.style.opacity = "0";
        word.style.transform = "translateY(0.6em)";
      }
    });
    stack.style.transition = `width 0.35s ${ease}`;
    fit();
    window.addEventListener("resize", fit);

    const timer = setInterval(() => {
      const current = items[index];
      index = (index + 1) % items.length;
      const next = items[index];
      current.style.opacity = "0";
      current.style.transform = "translateY(-0.6em)";
      fit();
      next.style.transition = "none";
      next.style.transform = "translateY(0.6em)";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          next.style.transition = `opacity 0.5s ${ease}, transform 0.5s ${ease}`;
          next.style.opacity = "1";
          next.style.transform = "translateY(0)";
        }),
      );
    }, 2600);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", fit);
    };
  }, [words]);

  return (
    <>
      {/* 스크린리더용 기본형 — 순환과 무관하게 항상 이 문구 하나만 읽힌다 */}
      <span className="sr-only">{words[0]}</span>
      <span
        ref={stackRef}
        aria-hidden="true"
        className="inline-grid justify-items-start overflow-visible text-left align-baseline"
      >
        {wordKeys.map((k, i) => (
          <span
            key={k}
            className="whitespace-nowrap [grid-area:1/1]"
            /* 첫 단어 외에는 서버 HTML 부터 숨긴다 — JS 가 없으면 기본형만 보인다 */
            style={i ? { opacity: 0, transform: "translateY(0.6em)" } : undefined}
          >
            <T k={k} />
          </span>
        ))}
      </span>
    </>
  );
}
