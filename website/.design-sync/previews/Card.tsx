import { Card, IconBubble, Icon, Chip, Badge, ButtonLink } from "website";

export const Basic = () => (
  <Card className="p-6" >
    <p style={{ fontWeight: 700, marginBottom: 6 }}>확인 후 연락드립니다.</p>
    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4A5468" }}>
      품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 안내해 드립니다.
    </p>
  </Card>
);

export const ServiceCard = () => (
  <div style={{ maxWidth: 340 }}>
    <Card className="p-6">
      <IconBubble>
        <Icon.truck style={{ width: 22, height: 22 }} />
      </IconBubble>
      <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 17 }}>수거 · 배송 대행</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4A5468" }}>
        수거부터 배송까지 사업장 세탁물을 대신 관리해 드립니다
      </p>
    </Card>
  </div>
);

export const IndustryCard = () => (
  <div style={{ maxWidth: 380 }}>
    <Card className="p-6">
      <Badge>장애인 표준사업장</Badge>
      <h3 style={{ marginTop: 14, marginBottom: 10, fontSize: 17 }}>이런 사업장과 함께합니다</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip>호텔</Chip>
        <Chip>모텔</Chip>
        <Chip>펜션</Chip>
        <Chip>사우나</Chip>
        <Chip>헬스장</Chip>
        <Chip>단체시설</Chip>
      </div>
    </Card>
  </div>
);

export const CtaCard = () => (
  <div style={{ maxWidth: 340 }}>
    <Card className="p-6">
      <h3 style={{ marginBottom: 8, fontSize: 17 }}>견적 · 상담 문의</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4A5468", marginBottom: 16 }}>
        확인 후 연락드립니다.
      </p>
      <ButtonLink href="/quote" block>견적 문의하기</ButtonLink>
    </Card>
  </div>
);
