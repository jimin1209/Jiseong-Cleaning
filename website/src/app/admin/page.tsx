import type { Metadata } from "next";
import Link from "next/link";
import { countInquiries } from "@/lib/inquiries";
import { countCopyDrafts } from "@/lib/copy-drafts";
import { adminLogoutAction } from "./login/actions";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MENUS = [
  {
    href: "/admin/edit",
    title: "문구 편집",
    description: "홈페이지 화면 그대로 보면서 텍스트를 클릭해 고치고, 1안·2안으로 저장합니다.",
  },
  {
    href: "/admin/proposals",
    title: "제안 게시판",
    description: "저장해 둔 문구 안들을 모아 보고 비교합니다.",
    countKey: "drafts" as const,
  },
  {
    href: "/admin/inquiries",
    title: "견적 문의 접수",
    description: "홈페이지 견적 문의 폼으로 들어온 접수 내역입니다.",
    countKey: "inquiries" as const,
  },
];

export default async function AdminHubPage() {
  // 저장소 장애가 허브 자체를 죽이지 않게 한다 — 실패 시 개수만 감춘다
  const counts: { inquiries?: number; drafts?: number } = {};
  let storeError = false;
  try {
    [counts.inquiries, counts.drafts] = await Promise.all([
      countInquiries(),
      countCopyDrafts(),
    ]);
  } catch (err) {
    console.error("[admin] 저장소 조회 실패", err);
    storeError = true;
  }

  return (
    <div className="min-h-screen bg-paper py-10">
      <Container>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-faint">
              관 리 자
            </p>
            <h1 className="mt-1 text-[1.5rem] text-navy">지성크리닝 관리</h1>
          </div>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="rounded-brand border border-line-strong bg-white px-4 py-2 text-[0.8125rem] font-bold text-muted transition-colors duration-150 hover:border-brand hover:text-brand"
            >
              로그아웃
            </button>
          </form>
        </header>

        {storeError && (
          <p className="mb-6 rounded-brand border border-danger/30 bg-danger-bg px-4 py-3 text-[0.8125rem] font-semibold text-danger">
            저장소 연결 오류 — 접수·문구 안 개수를 불러오지 못했습니다. 메뉴는 그대로
            사용할 수 있습니다.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MENUS.map((menu) => {
            const count = menu.countKey ? counts[menu.countKey] : undefined;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="group rounded-brand border border-line bg-white p-6 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-raised"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[1.0625rem] font-bold text-navy group-hover:text-brand">
                    {menu.title}
                  </h2>
                  {count !== undefined && (
                    <span className="rounded-full bg-brand/8 px-2.5 py-0.5 text-[0.75rem] font-bold text-brand" data-numeric>
                      {count}건
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                  {menu.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[0.8125rem] font-bold text-brand">
                  바로가기 <span aria-hidden>→</span>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-[0.8125rem] text-faint">
          로그인은 30일 동안 유지됩니다. 홈페이지 맨 아래 “관리자” 링크로 언제든
          들어올 수 있습니다.
        </p>
      </Container>
    </div>
  );
}
