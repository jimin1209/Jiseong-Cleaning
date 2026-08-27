"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveCopyDraftAction } from "./actions";
import { useCopyEditStore } from "@/components/copy-edit-root";
import { Button } from "@/components/ui";
import { copy } from "@/lib/copy";
import type { CopyDraft } from "@/lib/copy-drafts";

/**
 * 편집 조작 패널 (명세 9-2).
 *
 * 페이지는 실제 모습 그대로 뒤에 렌더되고, 이 패널만 화면 왼쪽 아래에 뜬다.
 * 텍스트를 클릭하면(copy-edit-root.tsx 의 래퍼) 여기 팝오버가 열리고,
 * 입력하는 즉시 화면에 미리보기가 반영된다(로컬 오버라이드).
 * "제안 저장"을 눌러야 안(draft) 세트로 저장된다 — 실서비스 자동 반영 없음.
 *
 * z-[110]: 플로팅 도크·CTA 바(z-50)와 헤더 위, 스킵 링크(z-100)보다 위.
 */

const PAGE_TABS = [
  { key: "home", label: "홈" },
  { key: "about", label: "회사소개" },
  { key: "services", label: "서비스" },
  { key: "quote", label: "견적" },
] as const;

/** 클릭한 키 하나의 팝오버 — 입력 즉시 오버라이드에 반영(미리보기) */
function KeyEditor({ k, onClose }: { k: string; onClose: () => void }) {
  const { overrides, setOverride } = useCopyEditStore();
  const original = copy[k] ?? "";
  const value = overrides[k] ?? original;
  const edited = overrides[k] !== undefined;

  return (
    <div className="border-b border-line px-4 py-3.5">
      <p className="break-all font-mono text-[0.6875rem] text-faint">{k}</p>
      <p className="mt-2 whitespace-pre-wrap rounded-[6px] bg-tint px-2.5 py-2 text-[0.8125rem] leading-[1.6] text-ink-2">
        {original}
      </p>
      <textarea
        value={value}
        rows={Math.min(6, Math.max(2, Math.ceil(value.length / 28)))}
        onChange={(e) => setOverride(k, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        autoFocus
        className="mt-2 w-full rounded-[6px] border border-line px-2.5 py-2 text-[0.875rem] leading-[1.6] text-ink focus:border-brand focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOverride(k, original)}
          disabled={!edited}
          className="text-[0.78rem] font-bold text-muted hover:text-navy disabled:opacity-40"
        >
          원문으로 되돌리기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-[0.78rem] font-bold text-brand"
        >
          완료
        </button>
      </div>
    </div>
  );
}

export function EditorPanel({
  page,
  drafts,
  total,
}: {
  page: string;
  drafts: CopyDraft[];
  /** 지금까지 발급된 안 수 — 새 안 기본 제목("N안")의 번호 */
  total: number;
}) {
  const router = useRouter();
  const { overrides, resetOverrides, editingKey, setEditingKey } = useCopyEditStore();

  const [draftId, setDraftId] = useState<number | null>(null);
  const [title, setTitle] = useState(`${total + 1}안`);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const editCount = Object.keys(overrides).length;

  const startNew = () => {
    resetOverrides({});
    setDraftId(null);
    setTitle(`${total + 1}안`);
    setMessage(null);
  };

  const loadDraft = (id: number) => {
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;
    resetOverrides(
      Object.fromEntries(draft.edits.map((e) => [e.key, e.proposed])),
    );
    setDraftId(draft.id);
    setTitle(draft.title);
    setMessage(null);
  };

  const save = (overwrite: boolean) => {
    startSaving(async () => {
      const result = await saveCopyDraftAction({
        id: overwrite && draftId !== null ? draftId : undefined,
        title,
        page,
        overrides,
      });
      if (result.ok) {
        setDraftId(result.id);
        setMessage(`저장되었습니다 — #${result.id} ${title || ""}`.trim());
        router.refresh();
      } else {
        setMessage(result.error);
      }
    });
  };

  return (
    <aside
      // 미리보기 화면(뒤의 실페이지)을 가리지 않도록 왼쪽 아래에 고정
      className="fixed bottom-4 left-4 z-[110] w-[21.5rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-brand border border-line bg-white shadow-raised"
    >
      <header className="flex items-center justify-between gap-2 border-b border-line bg-navy px-4 py-2.5 text-white">
        <p className="text-[0.8125rem] font-extrabold tracking-[0.04em]">
          문구 편집 <span className="font-normal text-pale">— 클릭해서 수정</span>
        </p>
        <Link
          href="/admin/proposals"
          className="text-[0.75rem] font-bold text-pale hover:text-white"
        >
          제안 게시판 →
        </Link>
      </header>

      {/* 페이지 선택 — 이동해도 편집 중인 오버라이드는 유지된다(레이아웃 수준 상태) */}
      <nav className="flex gap-1 border-b border-line px-3 py-2">
        {PAGE_TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/edit?page=${t.key}`}
            className={`rounded-full px-3 py-1 text-[0.78rem] font-bold ${
              t.key === page ? "bg-navy text-white" : "text-ink-2 hover:bg-tint"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {editingKey && (
        <KeyEditor k={editingKey} onClose={() => setEditingKey(null)} />
      )}

      <div className="flex flex-col gap-2.5 px-4 py-3.5">
        {/* 안 선택 바 — 새 안 또는 기존 안을 불러와 이어서 수정 */}
        <div className="flex items-center gap-2">
          <select
            value={draftId ?? ""}
            onChange={(e) => {
              if (e.target.value === "") startNew();
              else loadDraft(Number(e.target.value));
            }}
            className="min-w-0 flex-1 rounded-[6px] border border-line px-2 py-1.5 text-[0.8125rem] text-ink"
          >
            <option value="">새 안</option>
            {drafts.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.id} {d.title} · {d.edits.length}건 · {d.status}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={startNew}
            className="shrink-0 text-[0.78rem] font-bold text-brand"
          >
            새 안
          </button>
        </div>

        <label className="flex items-center gap-2 text-[0.8125rem]">
          <span className="shrink-0 font-bold text-muted">안 제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${total + 1}안`}
            className="min-w-0 flex-1 rounded-[6px] border border-line px-2.5 py-1.5 text-ink focus:border-brand focus:outline-none"
          />
        </label>

        {/* placeholder 처럼 화면에서 클릭할 수 없는 속성 문구는 키로 직접 찾는다 */}
        <details>
          <summary className="cursor-pointer text-[0.78rem] font-bold text-muted">
            키로 직접 찾기 (placeholder 등)
          </summary>
          <input
            list="copy-key-list"
            placeholder="quoteForm.company.placeholder …"
            onChange={(e) => {
              if (copy[e.target.value] !== undefined) setEditingKey(e.target.value);
            }}
            className="mt-1.5 w-full rounded-[6px] border border-line px-2.5 py-1.5 font-mono text-[0.78rem] text-ink focus:border-brand focus:outline-none"
          />
          <datalist id="copy-key-list">
            {Object.keys(copy).map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
        </details>

        <div className="flex items-center gap-2 pt-0.5">
          <Button
            size="sm"
            disabled={saving || editCount === 0}
            onClick={() => save(true)}
          >
            {saving
              ? "저장 중…"
              : draftId !== null
                ? `#${draftId} 에 덮어쓰기`
                : "제안 저장"}
          </Button>
          {draftId !== null && (
            <Button
              size="sm"
              variant="ghost"
              disabled={saving || editCount === 0}
              onClick={() => save(false)}
            >
              새 안으로 저장
            </Button>
          )}
          <span className="ml-auto text-[0.78rem] font-bold text-ink-2" data-numeric>
            수정 {editCount}건
          </span>
        </div>

        {message && (
          <p className="text-[0.78rem] font-semibold text-brand" role="status">
            {message}
          </p>
        )}
      </div>
    </aside>
  );
}
