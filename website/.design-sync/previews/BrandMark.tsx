import { BrandMark } from "website";

export const Light = () => (
  <div style={{ width: 96 }}>
    <BrandMark className="w-full" />
  </div>
);

export const OnNavy = () => (
  <div
    style={{
      background: "#0E2450",
      padding: 24,
      borderRadius: 8,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div style={{ width: 96 }}>
      <BrandMark tone="dark" className="w-full" />
    </div>
  </div>
);

export const Glow = () => (
  <div
    style={{
      background: "#0E2450",
      padding: 24,
      borderRadius: 8,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div style={{ width: 96 }}>
      <BrandMark tone="glow" className="w-full" />
    </div>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
    {[32, 48, 72, 96].map((w) => (
      <div key={w} style={{ width: w }}>
        <BrandMark className="w-full" />
      </div>
    ))}
  </div>
);
