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
 * 실서비스 경로에서는 기본 런타임(copy.ts 그대로, 래퍼 없음)을 내려보내는
 * 패스스루라 화면 결과가 데이터화 전과 동일하다. /admin/edit 에서만
 * 오버라이드 맵과 클릭 래퍼를 주입해 모든 <T> 텍스트가 편집 가능해진다.
 *
 * 오버라이드는 아직 저장되지 않은 "미리보기" 로컬 상태다 — 저장은
 * 편집 패널(copy-editor-panel.tsx)이 서버 액션으로 "안" 세트를 만들 때 일어난다.
 */

type EditStore = {
  /** 키 → 수정안. 원문과 같아지면 키가 제거된다 */
  overrides: Record<string, string>;
  setOverride: (key: string, value: string) => void;
  /** 안 불러오기·새 안 시작 — 오버라이드 전체를 갈아끼운다 */
  resetOverrides: (next: Record<string, string>) => void;
  /** 지금 팝오버로 편집 중인 키 */
  editingKey: string | null;
  setEditingKey: (key: string | null) => void;
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

/** 실서비스 경로용 기본 런타임 — copy-text.tsx 의 기본 컨텍스트와 같은 동작 */
const passthrough: CopyRuntime = { get: (key) => copy[key] ?? "" };

export function CopyEditRoot({ children }: { children: ReactNode }) {
  const editing = usePathname() === "/admin/edit";

  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const setOverride = useCallback((key: string, value: string) => {
    setOverrides((prev) => {
      if (value === (copy[key] ?? "")) {
        if (prev[key] === undefined) return prev;
        const rest = { ...prev };
        delete rest[key];
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetOverrides = useCallback((next: Record<string, string>) => {
    setOverrides(next);
    setEditingKey(null);
  }, []);

  const store = useMemo<EditStore>(
    () => ({ overrides, setOverride, resetOverrides, editingKey, setEditingKey }),
    [overrides, setOverride, resetOverrides, editingKey],
  );

  const runtime = useMemo<CopyRuntime>(
    () =>
      editing
        ? { get: (key) => overrides[key] ?? copy[key] ?? "", Wrap: EditWrap }
        : passthrough,
    [editing, overrides],
  );

  return (
    <EditStoreContext.Provider value={store}>
      <CopyProvider value={runtime}>{children}</CopyProvider>
    </EditStoreContext.Provider>
  );
}
