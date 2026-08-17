import { Icon } from "./icons";
import { faqs, type Faq } from "@/lib/faq";

/**
 * 자주 묻는 질문.
 * details/summary 를 쓴 이유는 JS 없이 열리고, 검색엔진이 답 본문을 읽을 수 있어서다.
 */
export function FaqList({ items = faqs }: { items?: Faq[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-brand border border-line bg-white">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-start gap-3.5 px-5 py-4 transition-colors duration-150 hover:bg-tint/60 sm:px-6">
            <span className="mt-0.5 text-[0.9375rem] font-extrabold text-sky" aria-hidden="true">
              Q
            </span>
            <span className="flex-1 text-[0.9375rem] font-bold text-navy sm:text-base">
              {item.q}
            </span>
            <Icon.chevronRight
              className="mt-1 size-4 shrink-0 text-faint transition-transform duration-200 ease-brand group-open:rotate-90"
              aria-hidden="true"
            />
          </summary>
          <div className="flex gap-3.5 px-5 pb-5 sm:px-6">
            <span className="text-[0.9375rem] font-extrabold text-pale" aria-hidden="true">
              A
            </span>
            <p className="flex-1 text-[0.9375rem] leading-[1.8] text-ink-2">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** 검색결과에 Q&A 로 노출되도록 구조화 데이터를 낸다 */
export function FaqJsonLd({ items = faqs }: { items?: Faq[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
