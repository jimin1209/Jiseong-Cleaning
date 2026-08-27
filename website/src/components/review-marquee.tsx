import { T } from "./copy-text";
import { Card } from "./ui";
import { reviews } from "@/lib/sample";

/**
 * 후기 마퀴 (명세 4-3·9-1).
 *
 * 카드 목록을 두 번 렌더하고 트랙을 왼쪽으로 -50% 이동시키는 CSS 애니메이션이라
 * 이음새 없이 무한히 흐른다(키프레임은 globals.css 의 jc-marquee).
 * 모션을 끈 사용자에게는 멈춘 상태로 보이고, 마우스를 올려도 멈춘다.
 *
 * 후기 문구는 회사 초안 수령 전 더미(sample.ts) — 없으면 아무것도 그리지 않는다.
 */
export function ReviewMarquee() {
  // import 바인딩은 클로저 안에서 내로잉이 풀리므로 지역 변수로 받는다
  const items = reviews;
  if (!items) return null;

  // 두 번 이어 붙인다 — 뒤쪽 절반은 장식이므로 보조기기에서 숨긴다
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <ul className="jc-marquee flex">
        {loop.map((review, i) => (
          <li
            key={`${review.name}-${i}`}
            aria-hidden={i >= items.length || undefined}
            className="mr-4 w-[16.5rem] shrink-0"
          >
            {/* 이음새 복제분(뒤 절반)도 같은 키를 읽는다 — 편집 시 함께 바뀐다 */}
            <Card className="h-full p-6">
              <p className="text-[0.9375rem] font-semibold leading-[1.7] text-ink-2">
                “<T k={`reviews.${i % items.length}.quote`} />”
              </p>
              <p className="mt-3 text-[0.8125rem] font-bold text-muted">
                <T k={`reviews.${i % items.length}.name`} /> · <T k={`reviews.${i % items.length}.biz`} />
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
