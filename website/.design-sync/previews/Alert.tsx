import { Alert } from "website";

export const Warn = () => (
  <Alert tone="warn">
    수거·배송 가능 권역은 경주 인근을 기준으로 운영합니다. 사업장 지역을
    알려주시면 가능 여부를 확인해 드립니다.
  </Alert>
);

export const Ok = () => (
  <Alert tone="ok" title="접수되었습니다">
    담당자가 확인 후 연락드리겠습니다.
  </Alert>
);

export const Danger = () => (
  <Alert tone="danger">
    입력하지 않은 항목이 있습니다. 표시된 칸을 확인해 주세요.
  </Alert>
);
