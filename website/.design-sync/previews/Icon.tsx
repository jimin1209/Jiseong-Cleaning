import type * as React from "react";
import { Icon } from "website";

type IconMap = Record<
  string,
  (p: { className?: string; style?: React.CSSProperties }) => React.ReactNode
>;
const I = Icon as unknown as IconMap;

const cell = (name: string) => (
  <div
    key={name}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      width: 72,
      color: "#14306E",
    }}
  >
    {I[name]({ className: "size-6" })}
    <span style={{ fontSize: 11, color: "#5B6B82" }}>{name}</span>
  </div>
);

const grid = (names: string[]) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 8px" }}>
    {names.map(cell)}
  </div>
);

export const Core = () =>
  grid([
    "phone",
    "check",
    "arrowRight",
    "chevronRight",
    "chevronLeft",
    "menu",
    "close",
    "pin",
  ]);

export const Service = () =>
  grid([
    "linen",
    "kitchen",
    "contract",
    "clock",
    "shield",
    "doc",
    "truck",
    "coin",
    "building",
    "seal",
    "camera",
    "alert",
  ]);

export const Industry = () => grid(["hotel", "motel", "pension", "office", "group"]);

export const Channels = () => grid(["chat", "sms", "bot", "instagram", "blog"]);

export const SizesAndColor = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <span style={{ color: "#14306E" }}>{I.phone({ className: "size-4" })}</span>
    <span style={{ color: "#14306E" }}>{I.phone({ className: "size-6" })}</span>
    <span style={{ color: "#14306E" }}>{I.phone({ className: "size-8" })}</span>
    <span style={{ color: "#00AEEF" }}>{I.phone({ className: "size-10" })}</span>
  </div>
);
