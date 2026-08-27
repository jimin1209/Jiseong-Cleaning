import { Chip, Icon } from "website";

export const Default = () => <Chip>호텔</Chip>;

export const Industries = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 420 }}>
    <Chip>호텔</Chip>
    <Chip>모텔</Chip>
    <Chip>펜션</Chip>
    <Chip>사우나</Chip>
    <Chip>헬스장</Chip>
    <Chip>단체시설</Chip>
  </div>
);

export const WithIcon = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <Chip>
      <Icon.hotel style={{ width: 15, height: 15 }} />
      호텔
    </Chip>
    <Chip>
      <Icon.pension style={{ width: 15, height: 15 }} />
      펜션
    </Chip>
    <Chip>
      <Icon.group style={{ width: 15, height: 15 }} />
      단체시설
    </Chip>
  </div>
);
