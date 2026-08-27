import { BrandLockup } from "website";

export const Default = () => <BrandLockup />;

export const NoParent = () => <BrandLockup showParent={false} />;

export const OnNavy = () => (
  <div style={{ background: "#0E2450", padding: 24, borderRadius: 8 }}>
    <BrandLockup tone="dark" />
  </div>
);

export const OnNavyNoParent = () => (
  <div style={{ background: "#0E2450", padding: 24, borderRadius: 8 }}>
    <BrandLockup tone="dark" showParent={false} />
  </div>
);
