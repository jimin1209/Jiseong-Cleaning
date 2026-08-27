"use client";

import { createContext, useContext, type ComponentType } from "react";
import { copy } from "@/lib/copy";

/**
 * 문구 접근 계층 (명세 9-2).
 *
 * 실서비스: <T k="…" /> 는 copy.ts 의 값을 그대로 텍스트로 낸다 — 래퍼 요소가
 * 없어 HTML 텍스트가 데이터화 전과 동일하다.
 *
 * 편집 모드(/admin/edit): CopyProvider 로 오버라이드 맵(get)과 클릭 래퍼(Wrap)를
 * 주입한다. 페이지 컴포넌트는 손대지 않고 전 텍스트가 편집 가능해진다.
 *
 * 서버 컴포넌트 안에서도 <T> 를 쓸 수 있다(클라이언트 참조로 SSR 됨).
 * 속성 문자열(placeholder 등)이 필요한 클라이언트 컴포넌트는 useCopy().get 을 쓴다.
 */

/** 편집 모드가 텍스트를 감싸는 래퍼 — 실서비스에서는 주입되지 않는다 */
export type CopyWrap = ComponentType<{ k: string; text: string }>;

export type CopyRuntime = {
  /** 키 → 현재 문구. 편집 모드에서는 오버라이드가 우선한다 */
  get: (key: string) => string;
  Wrap?: CopyWrap;
};

const CopyContext = createContext<CopyRuntime>({ get: (key) => copy[key] ?? "" });

export const CopyProvider = CopyContext.Provider;

export function useCopy(): CopyRuntime {
  return useContext(CopyContext);
}

/** 경로 키의 문구를 그대로 렌더한다 — 편집 모드에서만 클릭 래퍼가 붙는다 */
export function T({ k }: { k: string }) {
  const { get, Wrap } = useContext(CopyContext);
  const text = get(k);
  return Wrap ? <Wrap k={k} text={text} /> : <>{text}</>;
}
