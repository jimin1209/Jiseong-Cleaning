# 핸드오프 — S7: 디자인 보강(Claude Design 모션·시각 레이어 이식 D1~D11)

- 작성: S7 / 2026-08-28 (빌드·금지어·텍스트 불변 검증 후 종료)
- 커밋: `5125b2b` S7: 디자인 보강 — Claude Design 모션·시각 레이어 이식 (D1~D11) (단일 커밋, 브랜치 `work/s7`)

## 1. 완료한 것

병합 방안 D1~D11 전부 완료. 문구·구조·데이터는 D5·D6·D7의 허용된 신규 문구 외에 변경 없음. 스타일·keyframes·타이밍 값은 디자인 원본(`design-import/지성크리닝-홈-보강안.dc.html`)에서 그대로 가져오되 색상은 기존 디자인 토큰(`--color-*`)으로 치환.

- **D1 헤더 진행 바** — `site-header.tsx`. 기존 scrolled 스크롤 핸들러에 통합, 스크롤마다 리렌더하지 않도록 ref 로 width 직접 갱신. 헤더 하단 -2px, 2px, CI 그라디언트(ci-deep→ci-cyan).
- **D2 심볼 회전** — 히어로 워터마크 90초/회전. 위치 transform(-translate-y-1/2)과 회전 transform 이 겹치지 않도록 바깥 div(위치)/안쪽 BrandMark(jc-spin) 로 분리.
- **D3 글로우 이동** — 기존 글로우 div 에 `jc-glow`(14s ease-brand alternate).
- **D4 거품 6개** — 디자인 원본과 동일한 위치·크기·주기·투명도. 데이터는 page.tsx `bubbles` 배열, 주기·지연은 CSS 커스텀 속성(`--bub-dur`·`--bub-delay`)으로 넘겨 reduced-motion 에서 CSS 만으로 정지 가능하게 함.
- **D5 로테이팅 키워드** — 신규 `components/rotating-words.tsx`(클라이언트). "사업장 세탁물을→호텔 시트를→펜션 이불을→사우나 수건을" 2.6초 순환, 폭 추적(fit)·교차 페이드 로직은 디자인 스크립트 이식. 스크린리더에는 기본형만(sr-only + 순환 스택 aria-hidden). 서버 HTML 은 기본형만 보이게 나가므로 무-JS 에서도 문장이 완성됨. reduced-motion 시 순환 미시작.
- **D6 글래스 일정 카드** — 신규 `components/schedule-card.tsx`(서버). 주간 캘린더(월·목 수거=파란 핑, 수·토 배송=흰 링) + 수거→세탁→배송 진행 점(jc-dot 9s) + 카드 부유(jc-float). 문구는 병합 방안 표 그대로: "정기 수거 · 배송 일정" / "세탁 · 살균" / "사업장 배송" / "주 2회 수거 예시" / "요일과 주기는 상담으로 정합니다 · 예시 화면" 각주 유지. 예시 화면이므로 카드 전체 aria-hidden.
- **D7 마퀴 배지** — S4 마퀴는 후기 전용 컴포넌트라 재사용 대신 **같은 패턴**(globals.css `jc-marquee` 클래스는 재사용, 34s 로 오버라이드)으로 히어로 하단에 인라인 구현. 문구는 교체 목록만: 정기 수거·전문 세탁·살균 공정·건조 정리·약속한 날짜 배송·월 단위 정기 계약·사업장 전용. 이음새는 S4 방식(margin 기반, gap 아님)으로 정확히 -50% 순환.
- **D8 웨이브 전환** — 히어로→다음 섹션(자동 슬라이드, white) 사이 이중 물결 SVG(26s/17s reverse). 패스는 원본 그대로(주기 1440 = 트랙 폭의 50%라 이음새 없음).
- **D9 서비스 카드** — 홈 통합 1카드에 상단 3px CI 그라디언트 바 + hover 리프트 강화(-5px, 0.25s, 디자인 그림자 값).
- **D10 절차** — 연결선이 화면 진입 시 왼쪽부터 자라남(`reveal.tsx` 에 `grow` prop 신설 — 기존 원칙 그대로 JS 가 숨기고 JS 가 되살림, CSS 는 `[data-reveal-grow]` 변형만 추가). 4단계 카드는 `jc-step` 8.8s 주기 순차 하이라이트(시차 0/2.2/4.4/6.6s 는 `.jc-process li:nth-of-type` 로 부여). 새 4단계 문구 불변.
- **D11 reduce-motion** — 신규 모션 전부 globals.css 의 기존 `prefers-reduced-motion` 블록에서 정지. 거품은 멈추면 얼룩처럼 보여 `display:none` 처리. 로테이션·연결선 grow 는 reveal.tsx/컴포넌트의 기존 matchMedia 원칙을 따름.

미이식 목록(방안 3절: 벤토 강점, 3카드, 구 CTA, 식당·급식소 로테이션, 천북 배지, #cta 앵커)은 일절 가져오지 않음.

## 2. 변경 파일 요약

**신규 (2)**
- `src/components/rotating-words.tsx` : D5 로테이팅 키워드 (클라이언트)
- `src/components/schedule-card.tsx` : D6 글래스 일정 카드 (서버, aria-hidden)

**수정 (4)**
- `src/app/globals.css` : jc-spin·jc-glow·jc-bub·jc-wave·jc-float·jc-dot·jc-ping·jc-step keyframes + 유틸리티 + `[data-reveal-grow]` 변형 + reduced-motion 정지 일괄 추가
- `src/app/page.tsx` : 히어로 재구성(플렉스 2칼럼 + 일정 카드, 거품·회전·글로우, 로테이팅 h1, 마퀴 스트립, 웨이브), 서비스 카드 탑바·리프트, 절차 연결선 grow·jc-step. 상단에 rotatingWords·marqueeBadges·bubbles 상수
- `src/components/reveal.tsx` : `grow` prop 추가(가로선용 scaleX 변형), children 선택적으로 완화 — 기존 사용처 API 불변
- `src/components/site-header.tsx` : 진행 바 div + 스크롤 핸들러 확장(ref 갱신)
- 삭제한 파일 없음. S4 컴포넌트(플로팅·후기 마퀴·슬라이드) 무수정 — globals.css 의 `jc-marquee` 클래스만 공유

## 3. 검증 결과

- `npm run build`: **성공** (10 라우트, TS 통과)
- ESLint(변경 파일): 오류 0
- 금지어 스윕 `grep -rn "납품\|린넨\|리넨\|고온\|업소용\|취급하지\|천북\|054-621\|배달\|24시간\|고정 시간\|세탁일지" src/` → **0건**
- **텍스트 불변 검증(종료 조건 3)**: 변경 전후 각각 `npm run build` 후 `.next/server/app/{index,about,quote,services}.html` 에서 script/style 제거 → 태그 스트립 → 줄 단위 텍스트 추출해 diff.
  - about·quote·services: **diff 0** (완전 불변)
  - index(홈): 추가 줄만 존재, 전부 허용된 신규 문구 — D5 순환어 4줄(기본형은 sr-only 로도 유지되어 중복 1회 등장), D6 카드 15줄, D7 배지 7줄×2(이음새 복제분, aria-hidden). **기존 줄의 수정·삭제 0**
  - 재현 방법: 두 커밋에서 각각 빌드 후 위 추출 스크립트(파이썬 3줄: `re.sub(r'<(script|style)...')` → `re.sub(r'<[^>]+>','\n')` → 공백 줄 제거)를 돌려 diff
- 생성 CSS 실측: `@keyframes jc-*` 10종 전부 존재, 임의값 클래스(`animation-duration:34s`, `duration-[250ms]`, `bg-ci-cyan/18` 등) 생성 확인

## 4. 발견사항 (범위 밖 — 기록만)

- 홈 히어로의 좌측 텍스트 칼럼 내부 들여쓰기가 재구성 과정에서 부모와 같은 레벨로 남음(동작 무관, 포매터 돌리면 정리됨).
- 헤더 진행 바는 모바일 메뉴가 열리면 펼쳐진 메뉴 아래에 붙음(헤더 absolute 하단 기준). 시각적으로 어색하진 않으나 메뉴 열림 시 숨김이 낫다면 한 줄 조건 추가로 가능.

## 5. 질문 / 판단 보류

- **D7 "건조 정리" 표기**: 병합 방안의 교체 목록이 항목 구분자 "·" 로 나열돼 있어 "건조 정리"(디자인 원본은 "건조 · 정리")를 한 항목으로 그대로 씀. 가운뎃점을 살릴지 회의 검토 대상.
- **D5 순환어 색**: 디자인 원본은 순환어가 시안색이지만 현 사이트 h1 은 "대신 관리해 드립니다"가 시안색이라, 순환어는 기존대로 흰색 유지(색 구성 변경은 범위 밖으로 판단).
- **D6 요일 예시(월·목 수거/수·토 배송)**: 디자인 원본의 예시 그대로. 실제 운영 요일과 무관한 "예시 화면"임을 각주·배지로 표기했고 aria-hidden 처리. 예시 요일을 바꾸려면 schedule-card.tsx 의 `WEEK` 배열만 수정.
- **히어로 세로 패딩**: 카드 추가로 히어로가 약간 길어짐. 기존 py 값(lg:py-28)을 유지했는데 디자인 원본(84px)보다 여유 있는 편 — 답답하면 조정 여지.

## 6. 다음 세션에 주는 주의

- **reveal.tsx 에 `grow` prop 이 생김** — 기존 호출부는 전부 무변경으로 동작. 가로선을 등장시킬 땐 `<Reveal grow className="h-px ...">` 패턴(절차 섹션 참조). CSS 특이도 때문에 `[data-reveal="shown"][data-reveal-grow]` 규칙을 지우면 선이 영영 안 자란다.
- **jc-step 시차는 `.jc-process` 하위 li 순서에 의존** — 절차 ol 에서 li 앞에 li 를 추가하면 하이라이트 순서가 밀린다(연결선은 div 라 카운트에 안 걸림).
- **jc-marquee 를 34s 로 쓰는 곳은 홈 배지 스트립뿐**(`[animation-duration:34s]` 오버라이드). 후기 마퀴(42s)와 클래스를 공유하므로 globals.css 의 `.jc-marquee` 기본 주기를 바꾸면 양쪽이 함께 바뀐다.
- **거품·핑 등의 주기는 CSS 커스텀 속성으로 인라인 전달** — reduced-motion 정지가 클래스 레벨에서 걸리므로, 새 모션 요소에 `style={{animation: ...}}` 직결을 쓰면 D11 원칙이 깨진다(커스텀 속성 + 클래스 패턴을 따를 것).
- **schedule-card 는 전체 aria-hidden** — 카드 안에 실제 정보(링크·전화 등)를 넣으면 안 된다. 예시 화면 전용.
- **rotating-words 는 단어 배열 첫 항목이 스크린리더용 기본형** — 배열 순서를 바꾸면 접근성 문구도 바뀐다. 홈의 문구 출처는 page.tsx 상단 `rotatingWords` 상수.
- 워크트리 node_modules 하드링크 조치는 이미 되어 있었음(S1 발견사항 재발 없음).
- 커밋되지 않은 변경 없음. 병합·푸시 안 함.
