"use client";

import { useCopy } from "./copy-text";
import { smsBody } from "@/lib/sample";
import { mapLinksOf, site, smsHrefOf, telHrefOf } from "@/lib/site";

/**
 * 클라이언트 컴포넌트용 — 지금 화면에 떠 있는 전화번호와 그 번호로 만든 링크.
 *
 * 표시 문구(<T k="site.tel" />)와 tel:·sms: 링크가 같은 값에서 나오게 한다.
 * 편집자가 번호를 고치면 눌러서 거는 번호도 함께 바뀐다.
 * 서버 컴포넌트는 같은 일을 하는 lib/site-live.ts 의 siteValues() 를 쓴다.
 */

/** 지금 화면에 떠 있는 주소와 그 주소로 만든 지도 검색 링크 */
export function useSiteAddress() {
  const { get } = useCopy();
  const address = get("site.address") || site.address;

  return {
    address,
    mapLinks: address === site.address ? site.mapLinks : mapLinksOf(address),
  };
}

/** 지금 화면에 떠 있는 전화번호와 그 번호로 만든 tel:·sms: 링크 */
export function useSiteTel() {
  const { get } = useCopy();
  const tel = get("site.tel") || site.tel;
  const telMobile = get("site.telMobile") || site.telMobile;

  return {
    tel,
    // 고쳐진 적이 없으면 site.ts 의 기존 상수를 그대로 쓴다(동작 동일)
    telHref: tel === site.tel ? site.telHref : telHrefOf(tel),
    // 문자는 휴대전화로 보낸다 — 070 인터넷전화는 SMS 를 못 받는 경우가 있다
    smsHref: smsHrefOf(telMobile, smsBody),
    telMobile,
    telMobileHref:
      telMobile === site.telMobile ? site.telMobileHref : telHrefOf(telMobile),
  };
}
