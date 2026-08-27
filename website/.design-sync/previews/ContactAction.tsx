import { ContactAction } from "website";

export const TelVariants = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <ContactAction kind="tel" variant="primary">전화 문의</ContactAction>
    <ContactAction kind="tel" variant="tel">전화 문의</ContactAction>
    <ContactAction kind="tel" variant="ghost">전화 문의</ContactAction>
  </div>
);

export const SmsVariants = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <ContactAction kind="sms" variant="primary">문자 문의</ContactAction>
    <ContactAction kind="sms" variant="ghost">문자 문의</ContactAction>
  </div>
);

export const OnNavy = () => (
  <div style={{ background: "#14306E", padding: 24, display: "flex", gap: 12, borderRadius: 8 }}>
    <ContactAction kind="tel" variant="onNavy">전화 문의</ContactAction>
    <ContactAction kind="sms" variant="onNavyGhost">문자 문의</ContactAction>
  </div>
);
