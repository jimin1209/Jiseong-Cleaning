"use client";

import { useRouter } from "next/navigation";
import type { AdminOrderSummary } from "@/features/orders/repository";

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

export function OrdersTable({ orders }: { orders: AdminOrderSummary[] }) {
  const router = useRouter();

  if (orders.length === 0) {
    return <div className="empty-state">아직 접수된 주문이 없습니다.</div>;
  }

  function openOrder(orderNumber: string) {
    router.push(`/admin/orders/${encodeURIComponent(orderNumber)}`);
  }

  return (
    <div className="table-wrap">
      <table className="orders-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>거래처이름</th>
            <th>품목요약</th>
            <th>예상금액</th>
            <th>현재 상태</th>
            <th>주문시간</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderNumber}
              onClick={() => openOrder(order.orderNumber)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openOrder(order.orderNumber);
                }
              }}
              tabIndex={0}
            >
              <td><strong>{order.orderNumber}</strong></td>
              <td>{order.companyName}</td>
              <td className="item-summary">{order.itemSummary}</td>
              <td>{order.estimatedAmount.toLocaleString("ko-KR")}원</td>
              <td><span className="status-badge">{order.status}</span></td>
              <td>{dateTimeFormatter.format(new Date(order.createdAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
