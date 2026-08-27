import { ContactSplitLink } from "website";

export const TelAndSms = () => (
  <div
    style={{
      display: "flex",
      gap: 24,
      fontWeight: 700,
      color: "#14306E",
      fontSize: "0.9375rem",
    }}
  >
    <ContactSplitLink kind="tel">전화 010-9828-3637</ContactSplitLink>
    <ContactSplitLink kind="sms">문자 문의</ContactSplitLink>
  </div>
);
