"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/admin";
import { advanceOrderStatus } from "@/features/orders/repository";

export type AdvanceStatusState = { error?: string; success?: boolean };

export async function advanceStatusAction(
  orderNumber: string,
  _state: AdvanceStatusState,
): Promise<AdvanceStatusState> {
  void _state;
  const session = await requireAdminSession();

  try {
    advanceOrderStatus(orderNumber, session.userId);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderNumber}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "상태를 변경하지 못했습니다.",
    };
  }
}
