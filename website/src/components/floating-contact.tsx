"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DeviceSplit } from "./contact-action";
import { T } from "./copy-text";
import { Icon } from "./icons";
import { useSiteTel } from "./site-links";
import { ButtonLink } from "./ui";

/**
 * 우측 고정 문의 채널 도크 (명세 9-8).
 *
 * 접힌 런처 없이 채널 탭이 항상 펼쳐져 보인다 — 클릭 한 번으로 바로 문의(2026-08-28 지시).
 * 전화·SMS 는 기기별 분기(명세 9-3~9-5): SMS 는 모바일 전용.
 * 카카오톡 채널·챗봇은 미개설이라 탭만 먼저 노출(명세 9-7) —
 * 누르면 도크 왼쪽에 "준비 중" 안내를 띄우고 견적 문의로 유도한다.
 *
 * 배치: PC(lg↑)는 화면 오른쪽 가운데에 붙는 세로 도크,
 * 모바일은 하단 CTA 바 위 오른쪽에 아이콘 도크로 줄어든다.
 */

const itemClass =
  "group relative flex w-full flex-col items-center gap-1 px-2 py-2.5 text-center transition-colors duration-150 hover:bg-tint first:rounded-t-[0.875rem] last:rounded-b-[0.875rem]";

const labelClass =
  "hidden text-[0.6875rem] font-bold leading-tight text-navy lg:block";

function PendingDot() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-2 top-2 size-1.5 rounded-full bg-warn"
    />
  );
}

export function FloatingContact() {
  const { tel, telHref, smsHref } = useSiteTel();
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  // Esc 로 안내를 닫는다
  useEffect(() => {
    if (!notice) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotice(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notice]);

  // 미개설 채널 안내 — 잠시 보여주고 스스로 사라진다. 문구는 copy 키로 가리킨다
  const showNotice = (messageKey: string) => {
    setNotice(messageKey);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 6000);
  };

  const item = (glyph: ReactNode, label: ReactNode) => (
    <>
      <span className="flex size-8 items-center justify-center rounded-full bg-tint text-brand transition-colors duration-150 group-hover:bg-brand group-hover:text-white">
        {glyph}
      </span>
      <span className={labelClass}>{label}</span>
    </>
  );

  return (
    <nav
      aria-label="문의 채널"
      className="fixed z-50 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-2 lg:bottom-auto lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
    >
      {/* 준비 중 안내 — 도크 왼쪽에 뜬다 */}
      {notice && (
        <div
          role="status"
          className="absolute bottom-0 right-[calc(100%+0.625rem)] w-60 rounded-brand border border-line bg-white px-3.5 py-3 text-[0.8125rem] font-semibold leading-relaxed text-navy shadow-raised lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
        >
          <T k={notice} />
          <ButtonLink
            href="/quote"
            size="sm"
            block
            className="mt-2.5"
            onClick={() => setNotice(null)}
          >
            <T k="floating.noticeCta" />
          </ButtonLink>
        </div>
      )}

      <div className="flex w-[3.25rem] flex-col divide-y divide-line overflow-hidden rounded-[0.875rem] border border-line bg-white/95 shadow-raised backdrop-blur-md lg:w-[4.5rem] lg:rounded-r-none lg:border-r-0">
        {/* ① 전화 — PC /quote · 모바일 즉시 발신 */}
        <DeviceSplit
          pc={
            <Link href="/quote" className={itemClass} title={tel}>
              {item(<Icon.phone className="size-4" />, <T k="floating.tel" />)}
            </Link>
          }
          mobile={
            <a href={telHref} className={itemClass}>
              {item(<Icon.phone className="size-4" />, <T k="floating.tel" />)}
            </a>
          }
        />

        {/* ② 견적 문의 폼 */}
        <Link href="/quote" className={itemClass}>
          {item(<Icon.doc className="size-4" />, <T k="floating.quote" />)}
        </Link>

        {/* ③ SMS — 모바일 전용(문자 자동 작성). PC 에는 표시하지 않는다 */}
        <a href={smsHref} className={`${itemClass} lg:hidden`}>
          {item(<Icon.sms className="size-4" />, <T k="floating.sms" />)}
        </a>

        {/* ④·⑤ 카카오톡 채널·챗봇 — 미개설, 탭만 먼저 노출 */}
        <button
          type="button"
          onClick={() => showNotice("floating.kakao.notice")}
          className={itemClass}
        >
          <PendingDot />
          {item(<Icon.chat className="size-4" />, <T k="floating.kakao" />)}
        </button>
        <button
          type="button"
          onClick={() => showNotice("floating.bot.notice")}
          className={itemClass}
        >
          <PendingDot />
          {item(<Icon.bot className="size-4" />, <T k="floating.bot" />)}
        </button>
      </div>
    </nav>
  );
}
