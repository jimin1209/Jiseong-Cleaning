import { permanentRedirect } from "next/navigation";

/**
 * 예전 서비스 상세(/services/linen · kitchen · contract)의 리다이렉트 스텁.
 * 서비스가 한 건으로 통합되며 상세 페이지를 없앴다 — 어떤 슬러그로 오든
 * 통합 페이지(/services)로 보낸다. next.config 를 건드리지 않는 라우트 수준 처리다.
 */
export default function ServiceDetailRedirect() {
  permanentRedirect("/services");
}
