"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DeviceSplit, smsHref } from "./contact-action";
import { Icon } from "./icons";
import { ButtonLink } from "./ui";
import { site } from "@/lib/site";

/**
 * 플로팅 통합 문의 위젯 (명세 9-8, 위치는 8-4 오른쪽 아래).
 *
 * 접힌 런처 하나만 떠 있다가, 누르면 문의 채널 다섯 개가 펼쳐진다.
 * 전화·SMS 는 기기별 분기(명세 9-3~9-5)를 따르고,
 * 카카오톡 채널·챗봇은 미개설이라 버튼만 먼저 노출한다(명세 9-7) —
 * 누르면 "준비 중" 안내를 띄우고 견적 문의로 유도한다.
 *
 * 모바일에서는 하단 CTA 바(mobile-cta-bar) 위에 겹치지 않게 띄운다.
 */

const rowClass =
  "flex w-full items-center gap-3 rounded-brand px-3.5 py-3 text-left text-[0.9375rem] font-bold text-navy transition-colors duration-150 hover:bg-tint";

function PendingTag() {
  return (
    <span className="ml-auto shrink-0 rounded-full bg-paper px-2 py-0.5 text-[0.6875rem] font-semibold text-muted">
      준비 중
    </span>
  );
}

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  // 접으면 안내도 같이 사라진다
  const close = () => {
    setOpen(false);
    setNotice(null);
  };

  // Esc 로도 닫힌다 — 헤더 메뉴와 같은 탈출 경로 규칙
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  // 미개설 채널 안내 — 잠시 보여주고 스스로 사라진다
  const showNotice = (message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 6000);
  };

  const rowBody = (glyph: ReactNode, label: string, sub?: string) => (
    <>
      {glyph}
      <span className="flex min-w-0 flex-col">
        {label}
        {sub && (
          <span className="text-xs font-semibold text-muted" data-numeric>
            {sub}
          </span>
        )}
      </span>
    </>
  );

  return (
    <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end lg:bottom-6 lg:right-6">
      {open && (
        <div
          id="contact-channels"
          className="mb-3 w-[17rem] rounded-brand border border-line bg-white p-2 shadow-raised"
        >
          <p className="px-3.5 pb-1 pt-2.5 text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
            문 의 채 널
          </p>

          {/* ① 전화 — PC /quote · 모바일 즉시 발신 */}
          <DeviceSplit
            pc={
              <Link href="/quote" onClick={close} className={rowClass}>
                {rowBody(<Icon.phone className="size-5 shrink-0 text-brand" />, "전화 문의", site.tel)}
              </Link>
            }
            mobile={
              <a href={site.telHref} className={rowClass}>
                {rowBody(<Icon.phone className="size-5 shrink-0 text-brand" />, "전화 문의", site.tel)}
              </a>
            }
          />

          {/* ② 문의 폼 */}
          <Link href="/quote" onClick={close} className={rowClass}>
            {rowBody(<Icon.doc className="size-5 shrink-0 text-brand" />, "견적 문의 폼")}
          </Link>

          {/* ③ SMS — 모바일 전용(문자 자동 작성). PC 에는 표시하지 않는다 */}
          <a href={smsHref} className={`${rowClass} lg:hidden`}>
            {rowBody(<Icon.sms className="size-5 shrink-0 text-brand" />, "문자 문의")}
          </a>

          {/* ④·⑤ 카카오톡 채널·챗봇 — 미개설, 버튼만 먼저 노출 */}
          <button
            type="button"
            onClick={() => showNotice("카카오톡 채널은 준비 중입니다. 견적 문의를 이용해 주세요.")}
            className={rowClass}
          >
            {rowBody(<Icon.chat className="size-5 shrink-0 text-brand" />, "카카오톡 채널")}
            <PendingTag />
          </button>
          <button
            type="button"
            onClick={() => showNotice("챗봇 상담은 준비 중입니다. 견적 문의를 이용해 주세요.")}
            className={rowClass}
          >
            {rowBody(<Icon.bot className="size-5 shrink-0 text-brand" />, "챗봇 상담")}
            <PendingTag />
          </button>

          {notice && (
            <div
              role="status"
              className="mx-1.5 mb-1.5 mt-1 rounded-brand bg-tint px-3.5 py-3 text-[0.8125rem] font-semibold leading-relaxed text-navy"
            >
              {notice}
              <ButtonLink href="/quote" size="sm" block className="mt-2.5" onClick={close}>
                견적 문의로 이동
              </ButtonLink>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="contact-channels"
        aria-label={open ? "문의 채널 닫기" : "문의 채널 열기"}
        className="flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-raised transition-colors duration-200 ease-brand hover:bg-brand-hover"
      >
        {open ? <Icon.close className="size-6" /> : <Icon.chat className="size-6" />}
      </button>
    </div>
  );
}
