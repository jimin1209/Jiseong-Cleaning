import { RotatingWords } from "website";

const words = [
  "사업장 세탁물을",
  "호텔 시트를",
  "펜션 이불을",
  "사우나 수건을",
] as const;

export const InHeading = () => (
  <h1
    style={{
      fontSize: 30,
      lineHeight: 1.3,
      letterSpacing: "-0.035em",
      fontWeight: 800,
      color: "#14306E",
      margin: 0,
    }}
  >
    <RotatingWords words={words} />
    <br />
    주기적으로 관리해 드립니다
  </h1>
);

export const OnNavyHero = () => (
  <div
    style={{
      background: "linear-gradient(150deg,#0E2450 0%,#14306E 58%,#1B4FA8 100%)",
      padding: "40px 32px",
      borderRadius: 8,
    }}
  >
    <h1
      style={{
        fontSize: 34,
        lineHeight: 1.26,
        letterSpacing: "-0.035em",
        fontWeight: 800,
        color: "#fff",
        margin: 0,
      }}
    >
      <RotatingWords words={words} />
      <br />
      맡겨 주세요
    </h1>
  </div>
);
