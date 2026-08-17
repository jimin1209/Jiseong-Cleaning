import { Icon } from "./icons";
import { SAMPLE_CONTENT } from "@/lib/sample";

/**
 * 샘플 내용 경고 배너.
 *
 * 더미 값이 켜져 있는 동안 화면 맨 위에 항상 뜬다.
 * 이 배너가 있는 상태로는 실수로 운영에 올릴 수 없다 — 그게 이 컴포넌트의 목적이다.
 * 끄는 방법: .env 에 NEXT_PUBLIC_SAMPLE_CONTENT=off
 */
export function SampleBanner() {
  if (!SAMPLE_CONTENT) return null;

  return (
    <div className="bg-warn text-white">
      <div className="mx-auto flex max-w-page items-start gap-2.5 px-5 py-2 sm:items-center sm:px-6 lg:px-8">
        <Icon.alert className="mt-0.5 size-4 shrink-0 sm:mt-0" />
        <p className="text-[0.78rem] leading-[1.6] font-semibold sm:text-[0.8125rem]">
          <strong className="font-extrabold">검토용 샘플</strong> — 사업자등록번호 ·
          인증번호 · 운영시간 · 처리능력 · 요금은 <strong>확인 전 임시값</strong>입니다.
          숫자가 <code className="font-mono">0</code> 으로 표시된 항목은 실제 값이
          아닙니다.
        </p>
      </div>
    </div>
  );
}
