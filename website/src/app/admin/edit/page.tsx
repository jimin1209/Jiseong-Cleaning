import type { Metadata } from "next";
import { EditorPanel } from "./editor-panel";
import AboutPage from "@/app/about/page";
import NotFound from "@/app/not-found";
import HomePage from "@/app/page";
import QuotePage from "@/app/quote/page";
import ServicesPage from "@/app/services/page";
import { countCopyDrafts, listCopyDrafts } from "@/lib/copy-drafts";
import { EMPTY_LIVE_COPY, readLiveCopy } from "@/lib/copy-live";

/**
 * 관리자 인라인 편집 (명세 9-2).
 *
 * 선택한 페이지의 "실제 컴포넌트"를 그대로 렌더한다 — 미리보기 전용 사본이 없다.
 * 헤더·푸터·플로팅 도크·모바일 CTA 바는 루트 레이아웃이 이 경로에도 렌더하므로
 * 화면 전체가 실서비스와 같은 모습이고, 그 모든 텍스트가 편집 대상이 된다
 * (편집 활성화는 copy-edit-root.tsx 가 경로를 보고 결정한다).
 *
 * 끝내는 방법은 둘이다.
 *   「사이트에 반영」 게시본(copy-live.ts)에 저장 — 방문자 화면이 바로 바뀐다
 *   「제안 저장」     안(copy-drafts.ts)으로만 저장 — 사이트는 그대로
 */

export const metadata: Metadata = {
  title: "문구 편집",
  robots: { index: false, follow: false },
};

/** 안 목록이 저장 즉시 보여야 하므로 캐시하지 않는다 */
export const dynamic = "force-dynamic";

/** 편집을 지원하는 페이지 — actions.ts 의 EDITABLE_PAGES 와 같아야 한다 */
const PAGES = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  quote: QuotePage,
  notfound: NotFound,
} as const;

function isEditablePage(page: string | undefined): page is keyof typeof PAGES {
  return page !== undefined && page in PAGES;
}

export default async function AdminEditPage({
  searchParams,
}: PageProps<"/admin/edit">) {
  const { page: raw } = await searchParams;
  const page = isEditablePage(typeof raw === "string" ? raw : undefined)
    ? (raw as keyof typeof PAGES)
    : "home";

  // 저장소 장애여도 편집 화면은 떠야 한다 (안 저장 시점에 다시 시도된다)
  let drafts: Awaited<ReturnType<typeof listCopyDrafts>> = [];
  let total = 0;
  let live = EMPTY_LIVE_COPY;
  let storeError = false;
  try {
    [drafts, total, live] = await Promise.all([
      listCopyDrafts(),
      countCopyDrafts(),
      readLiveCopy(),
    ]);
  } catch (err) {
    console.error("[admin/edit] 저장소 조회 실패", err);
    storeError = true;
  }
  const Preview = PAGES[page];

  return (
    <>
      {storeError && (
        <p className="mb-4 rounded-brand bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
          저장소 연결 오류 — 목록을 불러오지 못했습니다. (접수·안 데이터는 저장소 복구 후 다시 표시됩니다)
        </p>
      )}
      <EditorPanel
        page={page}
        drafts={drafts}
        total={total}
        liveCount={Object.keys(live.overrides).length}
        liveUpdatedAt={live.updatedAt}
      />
      <Preview />
    </>
  );
}
