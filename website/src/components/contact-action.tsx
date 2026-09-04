"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSiteTel } from "./site-links";
import { ButtonAnchor, ButtonLink, type ButtonLook } from "./ui";

/**
 * 기기별 문의 동작 분기 (명세 9-3~9-5 동작 매트릭스).
 *
 *   전화류      PC → /quote 이동   모바일 → tel: 즉시 발신
 *   문의(SMS)류 PC → /quote 이동   모바일 → sms: 자동 작성
 *
 * 전화류는 대표전화(tel)와 휴대전화(telMobile) 두 가지다 — 두 번호를 나란히
 * 보여주므로 각 버튼은 자기 번호로 걸려야 한다.
 *
 * PC 에서 tel:/sms: 링크는 대부분 동작하지 않으므로 lg 이상은 견적 문의로 보낸다.
 * 판별은 UA 스니핑 대신 CSS 분기 — 두 요소를 모두 렌더하고 뷰포트에 맞는 쪽만 보인다.
 */

/*
 * tel:·sms: 주소는 상수로 굳히지 않고 useSiteTel() 로 그때그때 만든다 —
 * 편집자가 고친 번호가 표시 문구와 링크에 동시에 반영돼야 하기 때문이다.
 */

export type ContactKind = "tel" | "telMobile" | "sms";

/** 종류별 모바일 링크 — 보이는 번호와 걸리는 번호를 한 곳에서 맞춘다 */
function useContactHref(kind: ContactKind): string {
  const { telHref, telMobileHref, smsHref } = useSiteTel();
  if (kind === "tel") return telHref;
  if (kind === "telMobile") return telMobileHref;
  return smsHref;
}

/**
 * PC(lg 이상)와 모바일에 서로 다른 요소를 렌더한다.
 * 래퍼는 display:contents 라 부모의 flex·grid 레이아웃에 영향을 주지 않는다.
 */
export function DeviceSplit({ pc, mobile }: { pc: ReactNode; mobile: ReactNode }) {
  return (
    <>
      <span className="hidden lg:contents">{pc}</span>
      <span className="contents lg:hidden">{mobile}</span>
    </>
  );
}

/** 분기가 적용된 버튼 — 히어로·CTA 처럼 버튼 모양이 필요한 자리에 쓴다 */
export function ContactAction({
  kind,
  children,
  variant,
  size,
  block,
  className,
}: {
  /** tel = 대표전화, telMobile = 휴대전화, sms = 문의(SMS)류 */
  kind: ContactKind;
  children: ReactNode;
  className?: string;
} & ButtonLook) {
  const mobileHref = useContactHref(kind);
  return (
    <DeviceSplit
      pc={
        <ButtonLink href="/quote" variant={variant} size={size} block={block} className={className}>
          {children}
        </ButtonLink>
      }
      mobile={
        <ButtonAnchor href={mobileHref} variant={variant} size={size} block={block} className={className}>
          {children}
        </ButtonAnchor>
      }
    />
  );
}

/** 헤더처럼 버튼이 아닌 자리용 — 같은 내용에 PC/모바일 링크만 갈린다 */
export function ContactSplitLink({
  kind,
  className = "",
  pcClassName = "",
  mobileClassName = "",
  children,
}: {
  kind: ContactKind;
  className?: string;
  /** 반응형 표시 클래스가 서로 달라야 할 때만 쓴다 */
  pcClassName?: string;
  mobileClassName?: string;
  children: ReactNode;
}) {
  const mobileHref = useContactHref(kind);
  return (
    <DeviceSplit
      pc={
        <Link href="/quote" className={`${className} ${pcClassName}`.trim()}>
          {children}
        </Link>
      }
      mobile={
        <a href={mobileHref} className={`${className} ${mobileClassName}`.trim()}>
          {children}
        </a>
      }
    />
  );
}
