import { SectionHead } from "website";

export const Default = () => (
  <SectionHead
    eyebrow="서 비 스"
    title="사업장 규모, 품목과 물량에 따라 주기적으로 관리해 드립니다"
    lede="품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다."
  />
);

export const Centered = () => (
  <SectionHead
    align="center"
    eyebrow="견 적 · 상 담 문 의"
    title="확인 후 연락드립니다."
  />
);

export const OnDark = () => (
  <div style={{ background: "#14306E", padding: 32, borderRadius: 8 }}>
    <SectionHead
      tone="dark"
      eyebrow="사 회 적 가 치"
      title="장애인 표준사업장으로 운영합니다"
      lede="지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다."
    />
  </div>
);
