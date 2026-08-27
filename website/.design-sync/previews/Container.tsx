import { Container, SectionHead, Card } from "website";

export const Default = () => (
  <div style={{ background: "#EAF0F7", paddingTop: 24, paddingBottom: 24 }}>
    <Container>
      <div style={{ background: "#fff", borderRadius: 8, padding: 20, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#4A5468" }}>
          max-w-page 중앙 정렬 · 좌우 여백(모바일 20px → 데스크톱 32px)
        </p>
      </div>
    </Container>
  </div>
);

export const WithContent = () => (
  <div style={{ background: "#F7F9FC", paddingTop: 32, paddingBottom: 32 }}>
    <Container>
      <SectionHead
        eyebrow="서 비 스"
        title="수거부터 배송까지 사업장 세탁물을 대신 관리해 드립니다"
      />
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card className="p-5">
          <p style={{ fontWeight: 700, marginBottom: 4 }}>수거 · 배송 대행</p>
          <p style={{ fontSize: 14, color: "#4A5468" }}>사업장 세탁물을 대신 관리해 드립니다.</p>
        </Card>
        <Card className="p-5">
          <p style={{ fontWeight: 700, marginBottom: 4 }}>견적 · 상담 문의</p>
          <p style={{ fontSize: 14, color: "#4A5468" }}>확인 후 연락드립니다.</p>
        </Card>
      </div>
    </Container>
  </div>
);
