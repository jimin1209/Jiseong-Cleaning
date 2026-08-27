"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { slides } from "@/lib/sample";

/**
 * 자동 슬라이드 배너 (명세 8-6).
 *
 * 6초 간격으로 자동 넘김하고, 화살표·점으로 수동 조작도 된다.
 * 마우스가 올라가 있거나 포커스 중이거나 모션을 끈 사용자에게는 자동 넘김을 멈춘다.
 * 이미지 자료가 아직 없어 단색 배경+텍스트 카드다 —
 * slide.image(sample.ts)가 채워지면 그 슬라이드의 배경으로 깔린다.
 */
const INTERVAL_MS = 6000;

const tones = {
  navy: "bg-navy text-white",
  brand: "bg-brand text-white",
  tint: "bg-tint text-navy",
} as const;

export function AutoSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused, count]);

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="소개 배너"
      className="relative overflow-hidden rounded-brand shadow-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul
        className="flex transition-transform duration-500 ease-brand"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <li
            key={slide.id}
            aria-hidden={i !== index || undefined}
            className={`w-full shrink-0 ${tones[slide.tone]}`}
            style={
              slide.image
                ? {
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="flex min-h-[13rem] flex-col items-start justify-center px-14 py-10 sm:min-h-[15rem] sm:px-20">
              {slide.eyebrow && (
                <p className="mb-3 flex items-center gap-2.5 text-xs font-bold tracking-[0.13em] opacity-85">
                  <span
                    className="h-0.5 w-6 rounded-full bg-current opacity-70"
                    aria-hidden="true"
                  />
                  {slide.eyebrow}
                </p>
              )}
              <p className="max-w-[26em] text-[1.25rem] font-extrabold leading-[1.35] tracking-[-0.02em] sm:text-[1.5rem]">
                {slide.title}
              </p>
              {slide.body && (
                <p className="mt-3 max-w-[34em] text-sm leading-[1.75] opacity-85 sm:text-[0.9375rem]">
                  {slide.body}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 수동 넘김 화살표 */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="이전 슬라이드"
        className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy shadow-card transition-colors duration-150 hover:bg-white"
      >
        <Icon.chevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="다음 슬라이드"
        className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy shadow-card transition-colors duration-150 hover:bg-white"
      >
        <Icon.chevronRight className="size-5" />
      </button>

      {/* 위치 표시 점 — 밝은 슬라이드에서도 보이게 반투명 받침을 깐다 */}
      <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-navy/25 px-2.5 py-2 backdrop-blur-sm">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}번째 슬라이드로 이동`}
            aria-current={i === index || undefined}
            className={`size-2.5 rounded-full transition-colors duration-150 ${
              i === index ? "bg-white" : "bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
