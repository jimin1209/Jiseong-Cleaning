import { PageHero, ButtonLink } from "website";

export const Default = () => (
  <PageHero
    eyebrow="회 사 소 개"
    title="(주)지성이엔지 지성크리닝"
    lede="우수조달업체 (주)지성이엔지에서 운영하는 세탁 사업 부문입니다."
  />
);

export const TitleOnly = () => (
  <PageHero eyebrow="견 적 · 상 담 문 의" title="확인 후 연락드립니다." />
);

export const WithAside = () => (
  <PageHero
    eyebrow="서 비 스"
    title="사업장 세탁물을 주기적으로 관리해 드립니다"
    lede="품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다."
    aside={<ButtonLink href="/quote" variant="onNavy">견적 문의하기</ButtonLink>}
  />
);
