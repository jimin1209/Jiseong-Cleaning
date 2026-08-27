import { ButtonLink, TelButton } from "./ui";
import { site } from "@/lib/site";

/**
 * 모바일 하단 고정 바.
 *
 * 주 유입은 호텔 실장·식당 사장이 현장에서 급하게 검색하는 경우다.
 * 어느 위치까지 스크롤했든 전화와 견적 문의가 항상 화면 안에 있어야 한다.
 * (레이아웃에서 body 하단 패딩으로 가림을 방지한다)
 */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-line bg-white/95 px-3.5 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <TelButton
        tel="전화 문의"
        telHref={site.telHref}
        block
        className="flex-1 text-sm"
      />
      <ButtonLink href="/quote" block className="flex-1 text-sm">
        견적 문의
      </ButtonLink>
    </div>
  );
}
