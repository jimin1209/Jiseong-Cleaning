import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonAnchor, ButtonLink, type ButtonLook } from "./ui";
import { smsBody } from "@/lib/sample";
import { site } from "@/lib/site";

/**
 * 기기별 문의 동작 분기 (명세 9-3~9-5 동작 매트릭스).
 *
 *   전화류      PC → /quote 이동   모바일 → tel: 즉시 발신
 *   문의(SMS)류 PC → /quote 이동   모바일 → sms: 자동 작성
 *
 * PC 에서 tel:/sms: 링크는 대부분 동작하지 않으므로 lg 이상은 견적 문의로 보낸다.
 * 판별은 UA 스니핑 대신 CSS 분기 — 두 요소를 모두 렌더하고 뷰포트에 맞는 쪽만 보인다.
 */

/** sms: 링크 — 번호는 site.tel 에서 만들고, 문구는 sample.ts 더미(확정 대기)를 쓴다 */
export const smsHref = `sms:${site.tel.replace(/-/g, "")}${
  smsBody ? `?body=${encodeURIComponent(smsBody)}` : ""
}`;

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
  /** tel = 전화류, sms = 문의(SMS)류 */
  kind: "tel" | "sms";
  children: ReactNode;
  className?: string;
} & ButtonLook) {
  const mobileHref = kind === "tel" ? site.telHref : smsHref;
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
  kind: "tel" | "sms";
  className?: string;
  /** 반응형 표시 클래스가 서로 달라야 할 때만 쓴다 */
  pcClassName?: string;
  mobileClassName?: string;
  children: ReactNode;
}) {
  const mobileHref = kind === "tel" ? site.telHref : smsHref;
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
