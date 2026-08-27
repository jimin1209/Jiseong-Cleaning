import type { Metadata } from "next";
import { EditorPanel } from "./editor-panel";
import AboutPage from "@/app/about/page";
import HomePage from "@/app/page";
import QuotePage from "@/app/quote/page";
import ServicesPage from "@/app/services/page";
import { countCopyDrafts, listCopyDrafts } from "@/lib/copy-drafts";

/**
 * 관리자 인라인 편집 (명세 9-2).
 *
 * 선택한 페이지의 "실제 컴포넌트"를 그대로 렌더한다 — 미리보기 전용 사본이 없다.
 * 헤더·푸터·플로팅 도크·모바일 CTA 바는 루트 레이아웃이 이 경로에도 렌더하므로
 * 화면 전체가 실서비스와 같은 모습이고, 그 모든 텍스트가 편집 대상이 된다
 * (편집 활성화는 copy-edit-root.tsx 가 경로를 보고 결정한다).
 *
 * 저장은 "안" 세트 단위(제안) — 실서비스 문구는 여기서 바뀌지 않는다.
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

  const [drafts, total] = await Promise.all([listCopyDrafts(), countCopyDrafts()]);
  const Preview = PAGES[page];

  return (
    <>
      <EditorPanel page={page} drafts={drafts} total={total} />
      <Preview />
    </>
  );
}
