import { TelButton } from "website";

export const Default = () => (
  <TelButton tel="전화 문의" telHref="tel:+821098283637" />
);

export const Number = () => (
  <TelButton tel="010-9828-3637" telHref="tel:+821098283637" />
);

export const OnNavy = () => (
  <div style={{ background: "#14306E", padding: 24, display: "flex", gap: 12, borderRadius: 8 }}>
    <TelButton tel="010-9828-3637" telHref="tel:+821098283637" variant="onNavy" />
    <TelButton tel="전화 문의" telHref="tel:+821098283637" variant="onNavyGhost" />
  </div>
);

export const Block = () => (
  <div style={{ maxWidth: 360 }}>
    <TelButton tel="010-9828-3637" telHref="tel:+821098283637" size="lg" block />
  </div>
);
