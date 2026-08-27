import type { CSSProperties } from "react";

/**
 * 히어로 글래스 일정 카드 (디자인 보강 D6).
 *
 * 주간 캘린더(수거=파란 핑, 배송=흰 링)와 수거→세탁→배송 진행 점으로
 * 정기 운영의 리듬을 보여준다. 실제 계약 일정이 아니라 예시 화면이므로
 * "주 2회 수거 예시" 배지와 각주를 함께 표기한다.
 *
 * 전부 장식(예시)이라 보조기기에는 카드 전체를 숨긴다 — 요일·주기 정보는
 * 본문 어디에도 약속으로 적지 않는다는 원칙(services.ts 머리 주석)과 같은 이유.
 */

/** 예시 주간: 월·목 수거, 수·토 배송 — 디자인 원본의 예시 그대로 */
const WEEK = [
  { day: "월", mark: "pickup" },
  { day: "화", mark: null },
  { day: "수", mark: "delivery" },
  { day: "목", mark: "pickup" },
  { day: "금", mark: null },
  { day: "토", mark: "delivery" },
  { day: "일", mark: null },
] as const;

export function ScheduleCard() {
  return (
    <div aria-hidden="true" className="jc-float">
      <div className="rounded-brand border border-white/16 bg-white/7 p-6 pb-5 shadow-[0_24px_48px_-24px_rgb(4_12_32/0.55)] backdrop-blur-[10px]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.8125rem] font-extrabold tracking-[0.06em] text-white">
            정기 수거 · 배송 일정
          </p>
          <span className="whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[0.6875rem] font-bold text-pale shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]">
            주 2회 수거 예시
          </span>
        </div>

        {/* 주간 캘린더 */}
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {WEEK.map(({ day, mark }, i) => (
            <div key={day} className="text-center">
              <span
                className={`block text-[0.6875rem] font-semibold ${
                  day === "일" ? "text-[#7E93B5]" : "text-[#A6C5E8]"
                }`}
              >
                {day}
              </span>
              <span
                className={`relative mx-auto mt-2 block size-[34px] rounded-brand ${
                  mark === "pickup"
                    ? "bg-ci-cyan/18 shadow-[inset_0_0_0_1px_rgb(0_174_239/0.45)]"
                    : mark === "delivery"
                      ? "bg-white/9 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)]"
                      : day === "일"
                        ? "bg-white/3 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]"
                        : "bg-white/5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.10)]"
                }`}
              >
                {mark === "pickup" && (
                  <span
                    className="jc-ping absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ci-cyan"
                    /* 두 수거일 핑이 번갈아 울리도록 반 주기 늦춘다 */
                    style={i > 0 ? ({ "--ping-delay": "1.4s" } as CSSProperties) : undefined}
                  />
                )}
                {mark === "delivery" && (
                  <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[inset_0_0_0_2.5px_#fff]" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="mt-3 flex gap-4 text-[0.6875rem] font-semibold text-[#A6C5E8]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-[9px] rounded-full bg-ci-cyan" />
            수거
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-[9px] rounded-full shadow-[inset_0_0_0_2px_#fff]" />
            배송
          </span>
        </div>

        {/* 수거 → 세탁 → 배송 진행 점 */}
        <div className="mt-5 border-t border-white/12 pt-[18px]">
          <div className="relative h-0.5 bg-[linear-gradient(90deg,rgb(255_255_255/0.05),rgb(255_255_255/0.25)_20%,rgb(255_255_255/0.25)_80%,rgb(255_255_255/0.05))]">
            <span className="absolute left-[3%] top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#6FD6FF]" />
            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6FD6FF]" />
            <span className="absolute left-[93%] top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#6FD6FF]" />
            {/* 모션 정지 시에도 시작점(수거)에 놓이도록 기본 left 를 준다 */}
            <span className="jc-dot absolute left-[3%] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_2px_rgb(111_214_255/0.8)]" />
          </div>
          <div className="mt-2.5 flex justify-between text-[0.6875rem] font-semibold text-[#A6C5E8]">
            <span>사업장 수거</span>
            <span className="text-center">세탁 · 살균</span>
            <span className="text-right">사업장 배송</span>
          </div>
        </div>

        <p className="mt-4 text-[0.6875rem] text-[#8AA4C6]">
          요일과 주기는 상담으로 정합니다 · 예시 화면
        </p>
      </div>
    </div>
  );
}
