import { redirect } from "next/navigation";
import { getDemoSession } from "@/lib/auth/session";
import { getDemoPartner } from "@/features/partners/repository";
import { listProducts } from "@/features/orders/repository";
import { OrderForm } from "./order-form";

export default async function NewOrderPage() {
  const session = await getDemoSession();
  if (!session) redirect("/partner/login");
  const partner = getDemoPartner(session.userId);
  if (!partner) redirect("/partner/login");

  return (
    <main className="order-page">
      <header className="order-header">
        <div><p className="brand">JISEONG CLEANING · B2B</p><h1>세탁 발주 신청</h1></div>
        <div className="partner-badge"><span>거래처</span><strong>{partner.companyName}</strong></div>
      </header>
      <p className="order-guide">품목별 수량을 입력해 주세요. 단위는 원/장입니다.</p>
      <OrderForm products={listProducts()} />
    </main>
  );
}
