import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDemoPartner } from "@/features/partners/repository";
import { getOrderByNumberForPartner } from "@/features/orders/repository";
import { getDemoSession } from "@/lib/auth/session";

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

export default async function PartnerOrderDetailPage({
  params,
}: PageProps<"/orders/[orderNumber]">) {
  const session = await getDemoSession();
  if (!session || session.role !== "CUSTOMER") redirect("/partner/login");

  const partner = getDemoPartner(session.userId);
  if (!partner) redirect("/partner/login");

  const { orderNumber } = await params;
  const order = getOrderByNumberForPartner(orderNumber, session.userId);
  if (!order) notFound();

  return (
    <main className="admin-page detail-page">
      <Link className="back-link" href="/dashboard">← 내 발주</Link>
      <header className="detail-header">
        <div>
          <p className="brand">ORDER DETAIL</p>
          <h1>{order.orderNumber}</h1>
        </div>
      </header>
      <section aria-label="현재 발주 상태" className="partner-status-hero">
        <span>현재 상태</span>
        <strong>{order.status}</strong>
        <p>관리자가 상태를 변경하면 새로고침 후 최신 상태가 표시됩니다.</p>
      </section>
      <section className="detail-grid">
        <div><span>거래처</span><strong>{partner.companyName}</strong></div>
        <div><span>발주시간</span><strong>{dateTimeFormatter.format(new Date(order.createdAt))}</strong></div>
        <div><span>예상금액</span><strong>{order.estimatedAmount.toLocaleString("ko-KR")}원</strong></div>
      </section>
      <section className="detail-card">
        <h2>발주 품목</h2>
        <div className="detail-items">
          {order.items.map((item) => (
            <div className="detail-item" key={item.productId}>
              <div><strong>{item.productName}</strong><span>{item.unitPrice.toLocaleString("ko-KR")}원 / 장</span></div>
              <span>{item.quantity.toLocaleString("ko-KR")}장</span>
              <strong>{item.lineAmount.toLocaleString("ko-KR")}원</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
