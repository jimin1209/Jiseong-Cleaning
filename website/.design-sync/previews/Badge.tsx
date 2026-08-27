import { Badge, Icon } from "website";

export const Solid = () => <Badge>장애인 표준사업장</Badge>;

export const Outline = () => (
  <Badge tone="outline">
    <Icon.pin style={{ width: 14, height: 14 }} />
    경주 인근 권역
  </Badge>
);

export const OnNavy = () => (
  <div style={{ background: "#14306E", padding: 24, display: "flex", gap: 12, borderRadius: 8 }}>
    <Badge tone="onNavy">
      <Icon.seal style={{ width: 14, height: 14 }} />
      장애인 표준사업장
    </Badge>
    <Badge tone="onNavy">수거·배송 대행</Badge>
  </div>
);

export const Group = () => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
    <Badge>장애인 표준사업장</Badge>
    <Badge tone="outline">경주 인근 권역</Badge>
  </div>
);
