import { SnsButtons } from "website";

export const Light = () => <SnsButtons tone="light" />;

export const Dark = () => (
  <div
    style={{
      background: "#14306E",
      padding: 24,
      borderRadius: 8,
      display: "inline-flex",
    }}
  >
    <SnsButtons tone="dark" />
  </div>
);
