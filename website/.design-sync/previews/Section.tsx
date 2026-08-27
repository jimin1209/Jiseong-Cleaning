import { Section, Container, SectionHead, Chip, ButtonLink, TelButton } from "website";

export const Paper = () => (
  <Section tone="paper">
    <Container>
      <SectionHead
        eyebrow="서 비 스"
        title="수거부터 배송까지 사업장 세탁물을 대신 관리해 드립니다"
        lede="품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다."
      />
      <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip>호텔</Chip>
        <Chip>모텔</Chip>
        <Chip>펜션</Chip>
        <Chip>사우나</Chip>
        <Chip>헬스장</Chip>
        <Chip>단체시설</Chip>
      </div>
    </Container>
  </Section>
);

export const White = () => (
  <Section tone="white">
    <Container>
      <SectionHead
        align="center"
        eyebrow="견 적 · 상 담 문 의"
        title="확인 후 연락드립니다."
      />
      <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
        <ButtonLink href="/quote">견적 문의하기</ButtonLink>
        <TelButton tel="전화 문의" telHref="tel:+821098283637" variant="ghost" />
      </div>
    </Container>
  </Section>
);

export const Tint = () => (
  <Section tone="tint">
    <Container>
      <SectionHead
        eyebrow="사 회 적 가 치"
        title="장애인 표준사업장으로 운영합니다"
        lede="지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다."
      />
    </Container>
  </Section>
);

export const Navy = () => (
  <Section tone="navy">
    <Container>
      <SectionHead
        tone="dark"
        align="center"
        eyebrow="견 적 · 상 담 문 의"
        title="바로 문의하기"
        lede="확인 후 연락드립니다."
      />
      <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
        <ButtonLink href="/quote" variant="onNavy">견적 문의하기</ButtonLink>
        <TelButton tel="010-9828-3637" telHref="tel:+821098283637" variant="onNavyGhost" />
      </div>
    </Container>
  </Section>
);
