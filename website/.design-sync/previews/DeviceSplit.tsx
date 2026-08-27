import { DeviceSplit } from "website";

/** 캡처 뷰포트(900px, lg 미만)에서는 mobile 쪽이 렌더된다. */
export const Demo = () => (
  <div style={{ fontWeight: 700, color: "#14306E" }}>
    <DeviceSplit
      pc={<span>PC에서 보이는 내용</span>}
      mobile={<span>모바일에서 보이는 내용</span>}
    />
  </div>
);
