"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copy } from "@/lib/copy";
import { CopyProvider, type CopyRuntime } from "./copy-text";

/**
 * 문구 편집 모드의 뿌리 (명세 9-2).
 *
 * 루트 레이아웃이 body 전체를 이 컴포넌트로 감싼다. 헤더·푸터·플로팅 도크처럼
 * 레이아웃이 렌더하는 공용 컴포넌트까지 편집 대상에 넣으려면 프로바이더가
 * 페이지가 아니라 레이아웃 수준에 있어야 하기 때문이다.
 *
 * 문구는 세 겹으로 쌓인다 (아래가 우선):
 *   1. copy.ts            코드 원문
 *   2. published          편집자가 「사이트에 반영」한 게시본 (copy-live.ts)
 *   3. overrides          지금 편집 중인 미저장 수정 — /admin/edit 에서만
 *
 * 실서비스 경로에서는 1+2 만 쓰고 클릭 래퍼가 붙지 않는다.
 * /admin/edit 에서만 3번과 래퍼가 얹혀 모든 <T> 텍스트가 편집 가능해진다.
 */

type EditStore = {
  /** 키 → 수정안. 지금 사이트에 떠 있는 문구와 같아지면 키가 제거된다 */
  overrides: Record<string, string>;
  setOverride: (key: string, value: string) => void;
  /** 안 불러오기·새 안 시작 — 오버라이드 전체를 갈아끼운다 */
  resetOverrides: (next: Record<string, string>) => void;
  /** 지금 팝오버로 편집 중인 키 */
  editingKey: string | null;
  setEditingKey: (key: string | null) => void;
  /** 지금 사이트에 반영돼 있는 문구 (게시본) */
  published: Record<string, string>;
  /** 편집 전 기준값 — 게시본이 있으면 게시본, 없으면 코드 원문 */
  baseOf: (key: string) => string;
};

const EditStoreContext = createContext<EditStore | null>(null);

/** 편집 패널·클릭 래퍼가 공유하는 상태. /admin/edit 밖에서는 쓰지 않는다 */
export function useCopyEditStore(): EditStore {
  const store = useContext(EditStoreContext);
  if (!store) throw new Error("useCopyEditStore 는 CopyEditRoot 아래에서만 쓸 수 있다");
  return store;
}

/** 편집 모드에서 <T> 가 그리는 클릭 래퍼 — 호버 점선, 수정된 키는 주황 점선 유지 */
function EditWrap({ k, text }: { k: string; text: string }) {
  const store = useContext(EditStoreContext);
  const edited = store ? store.overrides[k] !== undefined : false;
  const active = store?.editingKey === k;

  const select = (e: { preventDefault(): void; stopPropagation(): void }) => {
    // 링크·버튼 속 텍스트를 눌러도 이동하지 않고 편집만 열리게 한다
    e.preventDefault();
    e.stopPropagation();
    store?.setEditingKey(k);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      data-copy-key={k}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") select(e);
      }}
      className={`cursor-pointer rounded-[3px] outline-offset-2 hover:outline hover:outline-1 hover:outline-dashed hover:outline-ci-cyan ${
        active
          ? "outline outline-2 outline-ci-cyan"
          : edited
            ? "outline outline-1 outline-dashed outline-warn"
            : ""
      }`}
    >
      {text}
    </span>
  );
}

export function CopyEditRoot({
  children,
  published = {},
}: {
  children: ReactNode;
  /** 서버(레이아웃)가 읽어 넘긴 게시본 — 실서비스 화면도 이 값을 쓴다 */
  published?: Record<string, string>;
}) {
  const editing = usePathname() === "/admin/edit";

  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const baseOf = useCallback(
    (key: string) => published[key] ?? copy[key] ?? "",
    [published],
  );

  const setOverride = useCallback(
    (key: string, value: string) => {
      setOverrides((prev) => {
        if (value === baseOf(key)) {
          if (prev[key] === undefined) return prev;
          const rest = { ...prev };
          delete rest[key];
          return rest;
        }
        return { ...prev, [key]: value };
      });
    },
    [baseOf],
  );

  const resetOverrides = useCallback((next: Record<string, string>) => {
    setOverrides(next);
    setEditingKey(null);
  }, []);

  const store = useMemo<EditStore>(
    () => ({
      overrides,
      setOverride,
      resetOverrides,
      editingKey,
      setEditingKey,
      published,
      baseOf,
    }),
    [overrides, setOverride, resetOverrides, editingKey, published, baseOf],
  );

  const runtime = useMemo<CopyRuntime>(
    () =>
      editing
        ? { get: (key) => overrides[key] ?? baseOf(key), Wrap: EditWrap }
        : { get: baseOf },
    [editing, overrides, baseOf],
  );

  return (
    <EditStoreContext.Provider value={store}>
      <CopyProvider value={runtime}>{children}</CopyProvider>
    </EditStoreContext.Provider>
  );
}
