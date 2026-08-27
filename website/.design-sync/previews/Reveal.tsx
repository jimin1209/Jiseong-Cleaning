import { Reveal, Card } from "website";

export const Default = () => (
  <Reveal>
    <Card>
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontWeight: 700, color: "#14306E", margin: 0 }}>
          스크롤 등장 래퍼
        </p>
        <p
          style={{
            fontSize: 14,
            color: "#5B6B82",
            lineHeight: 1.7,
            margin: "6px 0 0",
          }}
        >
          화면에 들어오면 한 번 위로 올라오며 나타납니다. 스크립트가 차단돼도
          내용은 처음부터 보입니다.
        </p>
      </div>
    </Card>
  </Reveal>
);

export const Sequence = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {["품목과 물량 확인", "수거 주기 제안", "확인 후 연락드립니다."].map(
      (label, i) => (
        <Reveal key={label} delay={i * 70}>
          <Card>
            <div style={{ padding: "14px 20px" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2A3D" }}>
                {label}
              </span>
            </div>
          </Card>
        </Reveal>
      ),
    )}
  </div>
);

export const Grow = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <span style={{ fontSize: 13, color: "#5B6B82" }}>
      절차 연결선용 — 왼쪽에서 자라나는 가로선
    </span>
    <Reveal grow>
      <div
        style={{
          height: 2,
          width: "100%",
          borderRadius: 999,
          background: "linear-gradient(90deg,#2E3192,#00AEEF)",
        }}
      />
    </Reveal>
  </div>
);
