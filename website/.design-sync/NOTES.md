# design-sync NOTES — 지성크리닝 website

## 레포 형태·빌드
- 이 레포는 컴포넌트 패키지가 아니라 **Next.js 앱** — dist 없음, synth-entry 모드로 `src/components/` 에서 엔트리 합성.
- 컨버터가 `node_modules/website` 자기 해석을 요구 → **`ln -sfn ../ node_modules/website` 심링크가 매 클론마다 필요** (gitignore 대상, 재생성 필수).
- `cfg.buildCmd`(`npm run build`)는 CSS 생성용 — `cssEntry` 는 `.next/static/chunks/<해시>.css` 라 **재빌드 후 해시가 바뀌면 config 갱신 필요** (빌드 후 `ls .next/static/chunks/*.css` 로 최신 확인).
- 폰트: `src/styles/pretendard.css` 는 사이트절대경로(`/fonts/…`)라 컨버터가 파일을 못 찾음 → `.design-sync/fonts-src/`(gitignore)에 상대경로 사본+woff2 를 생성해 `extraFonts` 로 연결. **매 클론마다 재생성**: `sed 's|/fonts/pretendard/|pretendard/|g' src/styles/pretendard.css > .design-sync/fonts-src/pretendard.css && cp -r public/fonts/pretendard .design-sync/fonts-src/pretendard` (public/fonts 는 `npm run setup:fonts` 산출물).
- `QuoteForm` 은 서버 액션(nodemailer·sqlite·netlify) 결합이라 **번들 제외**(`componentSrcMap: null`) — source-kit 포크가 파일 단위로도 제외한다.
- **libOverrides: source-kit.mjs** — ① null 컴포넌트의 소스 파일을 synth 엔트리에서 제외 ② 브라우저 `process` 심을 엔트리 첫 import 모듈로 주입 (ESM 은 import 를 먼저 평가하므로 인라인 문장으로는 늦음).
- `next/navigation` 은 `.design-sync/tsconfig.sync.json` 의 paths 로 `.design-sync/shims/next-navigation.ts` 에 매핑 — 앱 라우터 밖에서 `usePathname()` 이 null 이라 SiteHeader 가 깨지는 문제의 해결(BATCH-B). `cfg.tsconfig` 가 이 sync 전용 tsconfig 를 가리킴.

## 프리뷰 저작 시 알아둘 것 (웨이브 학습 통합)
- 번들 CSS 에는 **앱에서 실제 쓴 Tailwind 유틸리티만** 존재 (`w-24` 없음, `w-full`·`size-4/6/8/10` 있음) — 임의 크기는 inline style 래퍼.
- `BrandMark` 는 style prop 미지원(tone·className 만). `Card` 는 자체 패딩 없음(border+shadow 만) — 내부에서 패딩.
- `Icon` 은 네임스페이스 객체(27종: phone·check·doc·sms·chat·bot·pin·seal·truck 등)인데 .d.ts 가 ComponentType 으로 선언됨 — 프리뷰에서 캐스트 필요. (synth .d.ts 한계, 개선 여지)
- **캡처 뷰포트는 900px = lg 미만** → `DeviceSplit` 계열은 mobile 쪽이 렌더되고, `lg:hidden` 인 MobileCtaBar 가 보인다. PC 쪽 렌더 확인은 수동 브라우저 폭 확대로.
- fixed 포지션 컴포넌트(FloatingContact·MobileCtaBar)는 래퍼에 `transform:'translate(0)', position:'relative', overflow:'hidden'` 을 주면 containing block 이 생겨 셀 안에 도킹 — cardMode override 불필요.
- `Section tone="white"` 는 시트 배경과 동색이라 경계가 안 보이나 정상 (Known render warn 아님, 채점 노트 처리).

## Known render warns (재동기화 시 새 warn 아님)
- (현재 없음 — 최종 validate 후 갱신)

## 재동기화 위험 (Re-sync risks)
- **cssEntry 해시 표류**: `npm run build` 마다 `.next/static/chunks/*.css` 파일명이 바뀔 수 있음 — 재동기화는 빌드 후 반드시 cssEntry 를 최신 해시로 갱신해야 한다. 갱신 없이 돌리면 오래된 CSS 로 조용히 빌드됨.
- **fonts-src·node_modules/website 심링크·.design-sync/node_modules 링크**는 전부 gitignore — 새 클론에서 위 명령들로 재생성해야 빌드가 된다.
- **컴포넌트 추가 시**: 앱 전용(서버 결합) 컴포넌트면 componentSrcMap null 에 추가할 것. dtsPropsFor 는 수기 유지라 실소스와 표류 가능(IconBubble·Card 에서 이미 1회 발생) — 새 prop 추가 시 함께 갱신.
- 더미 데이터(sample.ts)가 실값으로 바뀌면 프리뷰 문구(후기·슬라이드)가 자동으로 바뀜 — 재캡처 시 시트 차이는 정상.
- SiteHeader 'Narrow' 셀은 컨테이너 420px vs 뷰포트 900px 미디어쿼리 불일치 아티팩트라 제거(Default 만 유지)

## Known adherence warns (재동기화 시 새 경고 아님 — 조치 금지)
- **`--tw-*` 상태 변형 선언 11건** (claude.ai/design 검사기 지적, 2026-08-28): `.hover\:…:hover`, `.focus\:…:focus`, `:where(.divide-y>…)` 내부의 `--tw-*` 할당. Tailwind가 hover/focus 를 구현하는 방식 자체라 `:root`/`[data-*]` 이동 시 hover 리프트·focus 링이 깨짐. 테마 토큰 아님 → 이동 대상 아님. `:root` 중립값 등록 우회도 검사기가 선언 위치를 보므로 무효(시도 후 되돌림). **컴파일 번들 수정 금지** — 실렌더·사용 무영향. 근본 해소는 원본 빌드 설정(Tailwind v4 출력) 차원의 문제로, 해소하려면 Tailwind 설정에서 상태 변형 커스텀 프로퍼티 출력 방식이 바뀌어야 하나 사이트 실사용에 이득이 없어 보류.
