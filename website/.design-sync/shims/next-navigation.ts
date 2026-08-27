// design-sync 프리뷰 전용 심 — 번들은 앱 라우터 밖에서 렌더되므로
// usePathname 이 null 을 반환해 SiteHeader 가 깨진다(BATCH-B 발견).
// 실서비스 코드는 이 파일을 쓰지 않는다 (tsconfig.sync.json 에서만 매핑).
export function usePathname(): string {
  return "/";
}
export function useRouter() {
  return { push: () => {}, replace: () => {}, back: () => {}, prefetch: () => {} };
}
