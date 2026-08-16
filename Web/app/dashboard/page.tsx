import Link from "next/link";
import { redirect } from "next/navigation";
import { getDemoPartner } from "@/features/partners/repository";
import { listOrdersByPartner } from "@/features/orders/repository";
import { getDemoSession } from "@/lib/auth/session";
import { logout } from "./actions";

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

export default async function DashboardPage() {
  const session = await getDemoSession();

  if (!session) redirect("/partner/login");
  if (session.role === "ADMIN") redirect("/admin/orders");

  const partner = getDemoPartner(session.userId);
  if (!partner) redirect("/partner/login");

  const orders = listOrdersByPartner(session.userId);

  return (
    <main className="partner-orders-page">
      <header className="partner-orders-header">
        <div>
          <p className="brand">JISEONG CLEANING · PARTNER</p>
          <h1>내 발주</h1>
          <p className="description">{partner.companyName}의 발주 내역입니다.</p>
        </div>
        <div className="partner-header-actions">
          <Link className="primary-link" href="/orders/new">새 발주</Link>
          <form action={logout}>
            <button className="secondary-button" type="submit">로그아웃</button>
          </form>
        </div>
      </header>

      {orders.length === 0 ? (
        <section className="empty-state">
          <p>아직 등록된 발주가 없습니다.</p>
          <Link className="primary-link" href="/orders/new">첫 발주 신청하기</Link>
        </section>
      ) : (
        <section aria-label="내 발주 목록" className="partner-order-list">
          {orders.map((order) => (
            <Link
              className="partner-order-card"
              href={`/orders/${encodeURIComponent(order.orderNumber)}`}
              key={order.orderNumber}
            >
              <div className="partner-order-card-head">
                <strong>{order.orderNumber}</strong>
                <span className="status-badge">{order.status}</span>
              </div>
              <p>{order.itemSummary || "품목 정보 없음"}</p>
              <div className="partner-order-meta">
                <span>{dateTimeFormatter.format(new Date(order.createdAt))}</span>
                <strong>{order.estimatedAmount.toLocaleString("ko-KR")}원</strong>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
