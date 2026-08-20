"use client";

import { useActionState, useMemo, useRef, useState, useTransition } from "react";
import type { Product } from "@/features/orders/repository";
import { createOrder, estimateOrder, type OrderState } from "./actions";

const initialState: OrderState = {};

export function OrderForm({ products }: { products: Product[] }) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [estimateError, setEstimateError] = useState("");
  const [isEstimating, startEstimate] = useTransition();
  const quantitiesRef = useRef<Record<number, number>>({});
  const estimateRequest = useRef(0);
  const [state, formAction, pending] = useActionState(createOrder, initialState);
  const items = useMemo(
    () => products.flatMap((product) => {
      const quantity = quantities[product.id] ?? 0;
      return quantity > 0 ? [{ productId: product.id, quantity }] : [];
    }),
    [products, quantities],
  );
  const itemsJson = JSON.stringify(items);

  function changeQuantity(productId: number, delta: number) {
    const nextQuantities = {
      ...quantitiesRef.current,
      [productId]: Math.max(
        0,
        Math.min(10000, (quantitiesRef.current[productId] ?? 0) + delta),
      ),
    };

    quantitiesRef.current = nextQuantities;
    setQuantities(nextQuantities);

    const nextItems = products.flatMap((product) => {
      const quantity = nextQuantities[product.id] ?? 0;
      return quantity > 0 ? [{ productId: product.id, quantity }] : [];
    });
    const requestId = estimateRequest.current + 1;
    estimateRequest.current = requestId;

    if (nextItems.length === 0) {
      setEstimatedAmount(0);
      setEstimateError("");
      return;
    }

    startEstimate(async () => {
      try {
        const amount = await estimateOrder(JSON.stringify(nextItems));
        if (estimateRequest.current === requestId) {
          setEstimatedAmount(amount);
          setEstimateError("");
        }
      } catch {
        if (estimateRequest.current === requestId) {
          setEstimatedAmount(0);
          setEstimateError("예상 금액을 계산하지 못했습니다.");
        }
      }
    });
  }

  return (
    <form action={formAction} className="order-form">
      <input name="items" type="hidden" value={itemsJson} />
      <div className="product-list">
        {products.map((product) => (
          <article className="product-row" key={product.id}>
            <div>
              <span className="category">{product.category}</span>
              <h2>{product.name}</h2>
              <p>{product.basePrice.toLocaleString("ko-KR")}원 / 장</p>
            </div>
            <div className="quantity-control" aria-label={`${product.name} 수량`}>
              <button aria-label="수량 감소" onClick={() => changeQuantity(product.id, -1)} type="button">−</button>
              <strong>{quantities[product.id] ?? 0}</strong>
              <button aria-label="수량 증가" onClick={() => changeQuantity(product.id, 1)} type="button">＋</button>
            </div>
          </article>
        ))}
      </div>
      <section className="order-summary">
        <div className="summary-total"><span>예상 금액</span><strong>{isEstimating ? "계산 중" : `${estimatedAmount.toLocaleString("ko-KR")}원`}</strong></div>
        <p>서버에 등록된 도매 단가를 기준으로 계산됩니다.</p>
        {estimateError ? <p className="error">{estimateError}</p> : null}
        {state.error ? <p className="error" aria-live="polite">{state.error}</p> : null}
        {state.orderNumber ? (
          <div className="order-complete" aria-live="polite">
            <span>발주가 접수되었습니다.</span>
            <strong>주문번호 {state.orderNumber}</strong>
            <strong>예상 금액 {state.estimatedAmount?.toLocaleString("ko-KR")}원</strong>
          </div>
        ) : null}
        <button className="primary-button" disabled={pending || isEstimating || estimatedAmount === 0} type="submit">
          {pending ? "저장 중..." : "주문하기"}
        </button>
      </section>
    </form>
  );
}
