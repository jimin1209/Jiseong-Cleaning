import { cache } from "react";
import { readLiveCopySafe } from "./copy-live";
import { mapLinksOf, site, smsHrefOf, telHrefOf } from "./site";
import { smsBody } from "./sample";

/**
 * 서버 컴포넌트가 쓰는 "지금 사이트에 떠 있는" 사업 정보.
 *
 * 편집자가 전화번호·주소를 고치면 표시 문구는 <T> 가 알아서 바뀌지만,
 * tel:·sms:·지도 링크처럼 **속성값**은 <T> 로 못 바꾼다. 그 링크들이 옛 값에
 * 남아 있으면 화면에는 새 번호가 보이는데 누르면 옛 번호로 걸리는 사고가 난다.
 * 그래서 링크는 전부 여기서 만들어 쓴다.
 *
 * react cache() 로 감싸 한 요청 안에서는 저장소를 한 번만 읽는다.
 * 고쳐진 적이 없으면 site.ts 의 기존 상수를 그대로 돌려주므로 동작이 같다.
 */
export const siteValues = cache(async () => {
  const { overrides } = await readLiveCopySafe();

  const tel = overrides["site.tel"] || site.tel;
  const address = overrides["site.address"] || site.address;

  return {
    tel,
    telHref: tel === site.tel ? site.telHref : telHrefOf(tel),
    smsHref: smsHrefOf(tel, smsBody),
    address,
    mapLinks: address === site.address ? site.mapLinks : mapLinksOf(address),
  };
});
