import { ButtonLink } from "website";

export const Primary = () => <ButtonLink href="/quote">견적 문의하기</ButtonLink>;

export const Variants = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <ButtonLink href="/quote" variant="primary">견적 문의하기</ButtonLink>
    <ButtonLink href="/contact" variant="tel">전화 문의</ButtonLink>
    <ButtonLink href="/service" variant="ghost">자세히 보기</ButtonLink>
  </div>
);

export const OnNavy = () => (
  <div style={{ background: "#14306E", padding: 24, display: "flex", gap: 12, borderRadius: 8 }}>
    <ButtonLink href="/quote" variant="onNavy">견적 문의하기</ButtonLink>
    <ButtonLink href="/contact" variant="onNavyGhost">전화 문의</ButtonLink>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <ButtonLink href="/quote" size="sm">바로 문의하기</ButtonLink>
    <ButtonLink href="/quote" size="md">바로 문의하기</ButtonLink>
    <ButtonLink href="/quote" size="lg">바로 문의하기</ButtonLink>
  </div>
);

export const Block = () => (
  <div style={{ maxWidth: 360 }}>
    <ButtonLink href="/quote" block>견적 문의하기</ButtonLink>
  </div>
);
