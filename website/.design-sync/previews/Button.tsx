import { Button } from "website";

export const Primary = () => <Button>견적 문의하기</Button>;

export const Variants = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button variant="primary">견적 문의하기</Button>
    <Button variant="tel">전화 문의</Button>
    <Button variant="ghost">자세히 보기</Button>
  </div>
);

export const OnNavy = () => (
  <div style={{ background: "#14306E", padding: 24, display: "flex", gap: 12, borderRadius: 8 }}>
    <Button variant="onNavy">견적 문의하기</Button>
    <Button variant="onNavyGhost">전화 문의</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button size="sm">바로 문의하기</Button>
    <Button size="md">바로 문의하기</Button>
    <Button size="lg">바로 문의하기</Button>
  </div>
);

export const Disabled = () => <Button disabled>접수 중…</Button>;
