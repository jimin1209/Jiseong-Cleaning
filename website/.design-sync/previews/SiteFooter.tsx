import { SiteFooter } from "website";

export const Default = () => <SiteFooter />;

export const Narrow = () => (
  <div style={{ maxWidth: 420, borderRadius: 8, overflow: "hidden" }}>
    <SiteFooter />
  </div>
);
