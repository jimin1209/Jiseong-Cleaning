import { FloatingContact } from "website";

/**
 * position:fixed 컴포넌트 — 래퍼에 transform 을 줘 containing block 을 만들어
 * 셀 안(오른쪽 아래)에 도크가 잡히게 한다.
 */
export const Docked = () => (
  <div
    style={{
      position: "relative",
      height: 400,
      transform: "translate(0)",
      overflow: "hidden",
      background: "#F4F7FB",
      borderRadius: 8,
    }}
  >
    <FloatingContact />
  </div>
);
