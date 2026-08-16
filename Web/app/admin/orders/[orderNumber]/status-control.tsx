"use client";

import { useActionState } from "react";
import { orderStatusSteps } from "@/features/orders/status";
import { advanceStatusAction, type AdvanceStatusState } from "./actions";

const initialState: AdvanceStatusState = {};

export function StatusControl({
  currentStatus,
  orderNumber,
}: {
  currentStatus: string;
  orderNumber: string;
}) {
  const action = advanceStatusAction.bind(null, orderNumber);
  const [state, formAction, pending] = useActionState(action, initialState);
  const currentIndex = orderStatusSteps.findIndex(
    (status) => status === currentStatus,
  );
  const isComplete = currentIndex === orderStatusSteps.length - 1;

  return (
    <section className="status-panel">
      <ol className="status-steps" aria-label="주문 진행 단계">
        {orderStatusSteps.map((status, index) => (
          <li
            className={
              index < currentIndex
                ? "complete"
                : index === currentIndex
                  ? "current"
                  : ""
            }
            key={status}
          >
            <span>{index + 1}</span>
            <strong>{status}</strong>
          </li>
        ))}
      </ol>
      <form action={formAction}>
        <button
          className="primary-button"
          disabled={pending || isComplete || currentIndex < 0}
          type="submit"
        >
          {isComplete ? "모든 단계 완료" : pending ? "변경 중..." : "다음 단계로"}
        </button>
      </form>
      {state.error ? <p className="error" aria-live="polite">{state.error}</p> : null}
    </section>
  );
}
