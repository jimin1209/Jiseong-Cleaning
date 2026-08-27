import { ButtonAnchor } from "website";

export const Tel = () => (
  <ButtonAnchor href="tel:+821098283637" variant="tel">전화 문의</ButtonAnchor>
);

export const Sms = () => (
  <ButtonAnchor href="sms:01098283637" variant="primary">바로 문의하기</ButtonAnchor>
);

export const Ghost = () => (
  <ButtonAnchor href="sms:01098283637" variant="ghost" size="sm">자세히 보기</ButtonAnchor>
);

export const OnNavy = () => (
  <div style={{ background: "#14306E", padding: 24, display: "flex", gap: 12, borderRadius: 8 }}>
    <ButtonAnchor href="tel:+821098283637" variant="onNavy">전화 문의</ButtonAnchor>
    <ButtonAnchor href="sms:01098283637" variant="onNavyGhost">바로 문의하기</ButtonAnchor>
  </div>
);
