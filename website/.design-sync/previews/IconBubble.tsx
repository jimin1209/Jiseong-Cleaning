import { IconBubble, Icon } from "website";

export const Default = () => (
  <IconBubble>
    <Icon.truck style={{ width: 22, height: 22 }} />
  </IconBubble>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <IconBubble size="sm">
      <Icon.check style={{ width: 18, height: 18 }} />
    </IconBubble>
    <IconBubble size="md">
      <Icon.check style={{ width: 22, height: 22 }} />
    </IconBubble>
  </div>
);

export const IconSet = () => (
  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
    <IconBubble><Icon.truck style={{ width: 22, height: 22 }} /></IconBubble>
    <IconBubble><Icon.shield style={{ width: 22, height: 22 }} /></IconBubble>
    <IconBubble><Icon.building style={{ width: 22, height: 22 }} /></IconBubble>
    <IconBubble><Icon.coin style={{ width: 22, height: 22 }} /></IconBubble>
  </div>
);

export const CardHead = () => (
  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
    <IconBubble>
      <Icon.phone style={{ width: 22, height: 22 }} />
    </IconBubble>
    <div>
      <p style={{ fontWeight: 700, marginBottom: 2 }}>전화 문의</p>
      <p style={{ fontSize: 14, color: "#4A5468" }}>010-9828-3637</p>
    </div>
  </div>
);
