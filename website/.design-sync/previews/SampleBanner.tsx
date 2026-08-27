import { SampleBanner } from "website";

export const Default = () => <SampleBanner />;

export const AtTopOfPage = () => (
  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #E3E9F2" }}>
    <SampleBanner />
    <div style={{ background: "#fff", padding: "28px 24px" }}>
      <p style={{ fontWeight: 800, color: "#14306E", margin: 0 }}>
        페이지 내용 영역
      </p>
      <p style={{ fontSize: 14, color: "#5B6B82", marginTop: 8, lineHeight: 1.7 }}>
        더미 값이 켜져 있는 동안 화면 맨 위에 항상 표시되는 경고 배너입니다.
      </p>
    </div>
  </div>
);
