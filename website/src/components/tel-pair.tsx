"use client";

import { Fragment } from "react";
import { ContactSplitLink } from "./contact-action";
import { T } from "./copy-text";

/**
 * 대표전화 · 휴대전화 두 줄 — 번호가 보이는 자리는 전부 이 서식을 쓴다.
 *
 * 번호가 둘로 늘면서 자리마다 다르게 조판하면 화면이 금세 지저분해진다.
 * 「라벨 + 번호」 한 쌍을 2열 그리드로 세워 **번호의 왼쪽 끝을 맞추고**,
 * 자리마다 다른 것은 배경 톤(tone)과 크기(size)뿐이다.
 *
 * 링크는 ContactSplitLink 라 기기별 분기(PC → /quote, 모바일 → 즉시 발신)를
 * 그대로 따르고, 각 줄은 **자기 번호로** 걸린다.
 */

const tones = {
  /** 흰 배경 */
  light: { label: "text-muted", num: "text-navy", hover: "hover:text-brand" },
  /** 남색 배경 */
  onNavy: { label: "text-[#A6C5E8]", num: "text-white", hover: "hover:text-[#6FD6FF]" },
  /** 푸터(더 짙은 남색) */
  dark: { label: "text-[#6E8CB4]", num: "text-pale", hover: "hover:text-white" },
} as const;

const sizes = {
  sm: { label: "text-[0.68rem]", num: "text-[0.9375rem]", gap: "gap-x-2.5 gap-y-0.5" },
  md: { label: "text-[0.72rem]", num: "text-[1.0625rem]", gap: "gap-x-3 gap-y-1" },
  lg: { label: "text-[0.75rem]", num: "text-[1.5rem]", gap: "gap-x-3.5 gap-y-1" },
} as const;

/** 위가 대표전화, 아래가 휴대전화. 순서는 어디서나 같다 */
const rows = [
  { kind: "tel", label: "tel.label.main", value: "site.tel" },
  { kind: "telMobile", label: "tel.label.mobile", value: "site.telMobile" },
] as const;

export function TelPair({
  tone = "light",
  size = "md",
  className = "",
}: {
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const t = tones[tone];
  const z = sizes[size];

  return (
    /* inline-grid 라 내용만큼만 차지한다 — 부모가 가운데 정렬이면 함께 가운데로 간다 */
    <dl className={`inline-grid grid-cols-[auto_auto] items-baseline ${z.gap} ${className}`}>
      {rows.map((row) => (
        <Fragment key={row.kind}>
          <dt className={`${z.label} ${t.label} font-bold tracking-[0.1em]`}>
            <T k={row.label} />
          </dt>
          <dd className="m-0">
            <ContactSplitLink
              kind={row.kind}
              className={`${z.num} ${t.num} ${t.hover} block rounded-brand font-extrabold tracking-[-0.02em] transition-colors duration-200 ease-brand`}
            >
              <span data-numeric>
                <T k={row.value} />
              </span>
            </ContactSplitLink>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
