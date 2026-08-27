import type { Metadata } from "next";
import Link from "next/link";
import { setDraftStatusAction } from "./actions";
import { Container } from "@/components/ui";
import {
  copyDraftBackend,
  getCopyDraft,
  listCopyDrafts,
  type CopyDraft,
  type CopyDraftStatus,
} from "@/lib/copy-drafts";

/**
 * 문구 제안 게시판 (명세 9-2).
 *
 * /admin/edit 에서 저장한 "안" 세트의 목록·상세.
 * 상태(제안/채택/반영)는 회의 결과를 표시하는 라벨이다 — "반영" 실행 버튼은
 * 만들지 않는다(수동 반영 원칙). 표 스타일은 admin/inquiries 와 같다.
 */

export const metadata: Metadata = {
  title: "문구 제안 게시판",
  robots: { index: false, follow: false },
};

/** 저장 즉시 반영돼야 하므로 캐시하지 않는다 */
export const dynamic = "force-dynamic";

const PAGE_LABELS: Record<string, string> = {
  home: "홈",
  about: "회사소개",
  services: "서비스",
  quote: "견적",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusStyles: Record<CopyDraftStatus, string> = {
  제안: "bg-tint text-navy",
  채택: "bg-ok-bg text-ok",
  반영: "bg-navy text-white",
};

function StatusBadge({ status }: { status: CopyDraftStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-bold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

/** 상세 — 키별 원문 vs 수정안 나란히 + 상태 토글 */
function DraftDetail({ draft }: { draft: CopyDraft }) {
  return (
    <>
      <div className="mb-5">
        <Link href="/admin/proposals" className="text-sm font-bold text-brand">
          ← 목록으로
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[1.375rem] text-navy">
            <span data-numeric>#{draft.id}</span> {draft.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            {PAGE_LABELS[draft.page] ?? draft.page} 페이지 · 수정{" "}
            <strong className="font-bold text-navy" data-numeric>
              {draft.edits.length}
            </strong>
            건 · {formatDate(draft.createdAt)}
            {draft.updatedAt !== draft.createdAt && (
              <> (수정 {formatDate(draft.updatedAt)})</>
            )}
          </p>
        </div>

        {/* 상태 토글 — 라벨 표시일 뿐, 어느 상태도 실서비스 문구를 바꾸지 않는다 */}
        <form action={setDraftStatusAction} className="flex items-center gap-1.5">
          <input type="hidden" name="id" value={draft.id} />
          {(["제안", "채택", "반영"] as const).map((s) => (
            <button
              key={s}
              type="submit"
              name="status"
              value={s}
              disabled={s === draft.status}
              className={`rounded-full px-3.5 py-1.5 text-[0.78rem] font-bold transition-colors ${
                s === draft.status
                  ? statusStyles[s]
                  : "text-muted hover:bg-tint hover:text-navy"
              }`}
            >
              {s}
            </button>
          ))}
        </form>
      </div>

      <div className="overflow-x-auto rounded-brand border border-line bg-white shadow-card">
        <table className="w-full min-w-[48rem] border-collapse text-sm">
          <thead>
            <tr>
              {["키", "원문", "수정안"].map((h) => (
                <th
                  key={h}
                  className="border-b border-line bg-tint px-4 py-3 text-left text-[0.6875rem] font-bold tracking-[0.08em] whitespace-nowrap text-navy"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draft.edits.map((e) => (
              <tr key={e.key} className="align-top">
                <td className="border-b border-line px-4 py-3.5 font-mono text-[0.75rem] break-all text-muted">
                  {e.key}
                </td>
                <td className="border-b border-line px-4 py-3.5 text-ink-2">
                  <span className="block max-w-[24rem] whitespace-pre-wrap">
                    {e.original}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="block max-w-[24rem] font-semibold whitespace-pre-wrap text-ink">
                    {e.proposed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DraftList({ drafts }: { drafts: CopyDraft[] }) {
  if (drafts.length === 0) {
    return (
      <div className="rounded-brand border border-line bg-white p-10 text-center text-muted shadow-card">
        아직 저장된 안이 없습니다.{" "}
        <Link href="/admin/edit" className="font-bold text-brand">
          문구 편집
        </Link>
        에서 첫 안을 만들어 보세요.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-brand border border-line bg-white shadow-card">
      <table className="w-full min-w-[48rem] border-collapse text-sm">
        <thead>
          <tr>
            {["안", "페이지", "상태", "수정 개수", "시각"].map((h) => (
              <th
                key={h}
                className="border-b border-line bg-tint px-4 py-3 text-left text-[0.6875rem] font-bold tracking-[0.08em] whitespace-nowrap text-navy"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {drafts.map((d) => (
            <tr key={d.id} className="align-top">
              <td className="border-b border-line px-4 py-3.5">
                <Link
                  href={`/admin/proposals?id=${d.id}`}
                  className="font-bold text-brand"
                >
                  <span data-numeric>#{d.id}</span> {d.title}
                </Link>
              </td>
              <td className="border-b border-line px-4 py-3.5 whitespace-nowrap text-ink-2">
                {PAGE_LABELS[d.page] ?? d.page}
              </td>
              <td className="border-b border-line px-4 py-3.5 whitespace-nowrap">
                <StatusBadge status={d.status} />
              </td>
              <td className="border-b border-line px-4 py-3.5 text-ink-2" data-numeric>
                {d.edits.length}건
              </td>
              <td
                className="border-b border-line px-4 py-3.5 text-[0.78rem] whitespace-nowrap text-muted"
                data-numeric
              >
                {formatDate(d.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminProposalsPage({
  searchParams,
}: PageProps<"/admin/proposals">) {
  const { id: rawId } = await searchParams;
  const id = typeof rawId === "string" ? Number(rawId) : NaN;
  const detail = Number.isInteger(id) ? await getCopyDraft(id) : null;

  let drafts: Awaited<ReturnType<typeof listCopyDrafts>> = [];
  let storeError = false;
  try {
    drafts = detail ? [] : await listCopyDrafts();
  } catch (err) {
    console.error("[admin/proposals] 저장소 조회 실패", err);
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
            <h1 className="mt-1.5 text-[1.625rem] text-navy">문구 제안 게시판</h1>
            <p className="mt-2 text-sm text-muted">
              편집 화면에서 저장한 안의 목록입니다. 채택 표시까지만 하며, 실제
              반영은 개발자가 수동으로 합니다.
            </p>
          </div>
          <Link href="/admin/edit" className="text-sm font-bold text-brand">
            문구 편집 화면 →
          </Link>
        </header>

      {storeError && (
        <p className="mb-4 rounded-brand bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
          저장소 연결 오류 — 목록을 불러오지 못했습니다. (접수·안 데이터는 저장소 복구 후 다시 표시됩니다)
        </p>
      )}
        {detail ? <DraftDetail draft={detail} /> : <DraftList drafts={drafts} />}

        <p className="mt-5 text-[0.78rem] leading-[1.7] text-muted">
          저장 위치 : <strong className="text-ink">{copyDraftBackend}</strong>
          {copyDraftBackend === "SQLite 파일" && (
            <>
              {" "}
              (<code>.data/copy-drafts.db</code>) — 서버를 옮기거나 배포 폴더를
              갈아끼울 때 이 파일을 함께 옮기지 않으면 제안 내역이 사라집니다.
            </>
          )}
        </p>
      </Container>
    </div>
  );
}
