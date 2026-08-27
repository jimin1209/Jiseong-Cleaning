import { MobileCtaBar } from "website";

/**
 * fixed bottom 바 — 래퍼 transform 으로 containing block 을 만들어 셀 하단에 고정.
 * lg:hidden 이라 캡처 폭(900px, lg 미만)에서 보인다.
 */
export const Docked = () => (
  <div
    style={{
      position: "relative",
      height: 160,
      transform: "translate(0)",
      overflow: "hidden",
      background: "#F4F7FB",
      borderRadius: 8,
    }}
  >
    <MobileCtaBar />
  </div>
);
