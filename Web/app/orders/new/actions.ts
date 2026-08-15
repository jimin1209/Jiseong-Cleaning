"use server";

import { getDemoSession } from "@/lib/auth/session";
import { getDemoPartner } from "@/features/partners/repository";
import { calculateOrder, createOrder as saveOrder, type OrderItemInput } from "@/features/orders/repository";

export type OrderState = { error?: string; estimatedAmount?: number; orderNumber?: string };

function parseItems(value: string): OrderItemInput[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("품목 정보 형식이 올바르지 않습니다.");
  return parsed.map((item) => {
    if (!item || typeof item !== "object") throw new Error("품목 정보 형식이 올바르지 않습니다.");
    const record = item as Record<string, unknown>;
    return { productId: Number(record.productId), quantity: Number(record.quantity) };
  });
}

async function requirePartner() {
  const session = await getDemoSession();
  if (!session) throw new Error("로그인이 필요합니다.");
  const partner = getDemoPartner(session.userId);
  if (!partner) throw new Error("거래처 로그인이 필요합니다.");
  return partner;
}

export async function estimateOrder(itemsJson: string) {
  await requirePartner();
  return calculateOrder(parseItems(itemsJson)).amount;
}

export async function createOrder(
  _state: OrderState,
  formData: FormData,
): Promise<OrderState> {
  try {
    const partner = await requirePartner();
    return saveOrder(partner.companyName, parseItems(String(formData.get("items") ?? "[]")));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "주문을 저장하지 못했습니다." };
  }
}
