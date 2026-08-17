import { Alert } from "./ui";
import {
  isDraft,
  priceGroups,
  priceOptions,
  priceTerms,
  type PriceGroup,
} from "@/lib/pricing";

const won = (n: number) => n.toLocaleString("ko-KR");

/**
 * 표준 단가표.
 *
 * 값이 확정 전이면(`isDraft`) 표 위에 반드시 경고를 띄운다 —
 * 원본 문서(`품목-단가표.md`)가 스스로 「예시 초안」이라고 밝히고 있으므로
 * 그 사실을 화면에서 지우면 안 된다.
 */
export function PriceTable({
  groups = priceGroups,
  showOptions = true,
  showTerms = true,
}: {
  groups?: PriceGroup[];
  showOptions?: boolean;
  showTerms?: boolean;
}) {
  return (
    <div>
      {isDraft && (
        <Alert tone="warn" className="mb-6 max-w-3xl">
          <strong className="block">아래 단가는 예시 초안입니다</strong>
          실제 계약 단가가 아닙니다. 거래처별 단가는 품목 · 물량 · 수거 주기에 따라
          따로 산정하므로, 물량을 알려주시면 정식 견적을 드립니다.
        </Alert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.label}
            className="overflow-hidden rounded-brand border border-line bg-white"
          >
            <h3 className="border-b border-line bg-tint px-4 py-3 text-[0.8125rem] font-bold tracking-[0.06em] text-navy">
              {group.label}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  {group.label} 표준 단가 — 단위 원 / 장, VAT 별도
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-line px-4 py-2 text-left text-[0.6875rem] font-bold tracking-[0.08em] text-faint"
                    >
                      품목
                    </th>
                    <th
                      scope="col"
                      className="border-b border-line px-4 py-2 text-right text-[0.6875rem] font-bold tracking-[0.08em] text-faint whitespace-nowrap"
                    >
                      원 / 장
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr key={item.name}>
                      <th
                        scope="row"
                        className="border-b border-line px-4 py-2.5 text-left font-medium text-ink-2 last:border-b-0"
                      >
                        {item.name}
                        {item.note && (
                          <span className="ml-1.5 text-[0.75rem] text-faint">
                            {item.note}
                          </span>
                        )}
                      </th>
                      <td
                        className="border-b border-line px-4 py-2.5 text-right font-bold whitespace-nowrap text-navy"
                        data-numeric
                      >
                        {item.price === null ? (
                          <span className="font-semibold text-muted">협의</span>
                        ) : (
                          won(item.price)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {showOptions && (
        <div className="mt-5 overflow-hidden rounded-brand border border-line bg-white">
          <h3 className="border-b border-line bg-tint px-4 py-3 text-[0.8125rem] font-bold tracking-[0.06em] text-navy">
            옵션
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[26rem] border-collapse text-sm">
              <tbody>
                {priceOptions.map((o) => (
                  <tr key={o.name}>
                    <th
                      scope="row"
                      className="border-b border-line px-4 py-2.5 text-left font-medium text-ink-2"
                    >
                      {o.name}
                    </th>
                    <td
                      className="border-b border-line px-4 py-2.5 font-bold whitespace-nowrap text-navy"
                      data-numeric
                    >
                      {o.extra}
                    </td>
                    <td className="border-b border-line px-4 py-2.5 text-[0.8125rem] text-muted">
                      {o.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTerms && (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {priceTerms.map((t) => (
            <div
              key={t.label}
              className="rounded-brand border border-line bg-paper px-4 py-3.5"
            >
              <dt className="text-[0.75rem] font-bold tracking-[0.06em] text-faint">
                {t.label}
              </dt>
              <dd className="m-0 mt-1 text-[0.9375rem] font-bold text-navy" data-numeric>
                {t.value}
              </dd>
              {t.note && (
                <dd className="m-0 mt-0.5 text-[0.75rem] leading-[1.6] text-muted">
                  {t.note}
                </dd>
              )}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
