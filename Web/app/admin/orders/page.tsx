import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/admin";
import { listOrders } from "@/features/orders/repository";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  await requireAdminSession();
  const orders = listOrders();

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="brand">JISEONG CLEANING · ADMIN</p>
          <h1>주문 관리</h1>
          <p className="description">접수된 전체 세탁 발주를 확인합니다.</p>
        </div>
        <Link className="secondary-link" href="/">서비스 홈</Link>
      </header>
      <section className="admin-summary">
        <span>전체 주문</span><strong>{orders.length}건</strong>
      </section>
      <OrdersTable orders={orders} />
    </main>
  );
}
