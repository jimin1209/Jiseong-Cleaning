"use client";

import type { ComponentProps } from "react";
import { useSiteAddress, useSiteTel } from "./site-links";
import { ButtonAnchor, type ButtonLook } from "./ui";

/**
 * 편집된 값을 따라가는 링크들.
 *
 * 서버 컴포넌트(페이지)에서 `href={site.telHref}` 처럼 상수를 박아 두면,
 * 편집자가 번호·주소를 고쳐도 링크만 옛 값으로 남는다. 이 컴포넌트들이
 * 표시 문구와 같은 출처(copy 런타임)에서 href 를 만들어 그 어긋남을 없앤다.
 */

/** tel: 링크 — 클래스·data-numeric 같은 속성은 그대로 통과시킨다 */
export function TelAnchor({
  children,
  ...rest
}: Omit<ComponentProps<"a">, "href">) {
  const { telHref } = useSiteTel();
  return (
    <a href={telHref} {...rest}>
      {children}
    </a>
  );
}

/** 버튼 모양의 tel: 링크 */
export function TelButtonAnchor({
  children,
  ...rest
}: ButtonLook & Omit<ComponentProps<"a">, "href">) {
  const { telHref } = useSiteTel();
  return (
    <ButtonAnchor href={telHref} {...rest}>
      {children}
    </ButtonAnchor>
  );
}

/** 지도 길찾기 버튼 — 검색어가 현재 주소를 따라간다 */
export function MapButtonAnchor({
  provider,
  children,
  ...rest
}: { provider: "naver" | "kakao" } & ButtonLook &
  Omit<ComponentProps<"a">, "href">) {
  const { mapLinks } = useSiteAddress();
  return (
    <ButtonAnchor href={mapLinks[provider]} {...rest}>
      {children}
    </ButtonAnchor>
  );
}
