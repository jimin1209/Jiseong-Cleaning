import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin";
import { getOrderByNumber } from "@/features/orders/repository";
import { StatusControl } from "./status-control";

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/orders/[orderNumber]">) {
  await requireAdminSession();
  const { orderNumber } = await params;
  const order = getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <main className="admin-page detail-page">
      <Link className="back-link" href="/admin/orders">← 주문 목록</Link>
      <header className="detail-header">
        <div>
          <p className="brand">ORDER DETAIL</p>
          <h1>{order.orderNumber}</h1>
        </div>
        <span className="status-badge">{order.status}</span>
      </header>
      <section className="detail-grid">
        <div><span>거래처이름</span><strong>{order.companyName}</strong></div>
        <div><span>주문시간</span><strong>{dateTimeFormatter.format(new Date(order.createdAt))}</strong></div>
        <div><span>예상금액</span><strong>{order.estimatedAmount.toLocaleString("ko-KR")}원</strong></div>
      </section>
      <StatusControl currentStatus={order.status} orderNumber={order.orderNumber} />
      <section className="detail-card">
        <h2>주문 품목</h2>
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
      <section className="detail-card history-card">
        <h2>상태 변경 이력</h2>
        {order.histories.length === 0 ? (
          <p className="history-empty">아직 상태 변경 이력이 없습니다.</p>
        ) : (
          <div className="history-list">
            {order.histories.map((history) => (
              <div className="history-row" key={`${history.createdAt}-${history.toStatus}`}>
                <div>
                  <strong>{history.fromStatus} → {history.toStatus}</strong>
                  <span>관리자 · {history.actorId.slice(0, 8)}</span>
                </div>
                <time dateTime={history.createdAt}>
                  {dateTimeFormatter.format(new Date(history.createdAt))}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
