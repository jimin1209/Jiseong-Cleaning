# 핸드오프 — S5: 관리자 인라인 편집(사이트 그대로 보며 모든 텍스트 편집)

- 작성: S5 / 2026-08-28 (빌드·텍스트 불변·실동작 curl 검증 후 종료)
- 커밋 (브랜치 `work/s5`, 3커밋 분리):
  - `f4d0233` S5: 1단계 문구 데이터화 — copy.ts 경로 키·<T> 접근 계층 신설 (4페이지 텍스트 불변)
  - `b3d73e8` S5: 2단계 편집 모드 — /admin/edit 실페이지 인라인 편집 + '안' 세트 저장
  - `310f479` S5: 3단계 제안 게시판 — /admin/proposals 목록·상세·상태 표시

## 1. 완료한 것

지시서 3단계 전부 완료. (참고: 이전 실행이 세션 한도로 중단되며 남긴 1단계 진행분 ~18파일을 되돌리지 않고 이어받아 services·quote 페이지 전환과 SectionHead 타입 완화로 마무리했다.)

1. **1단계 문구 데이터화 — 완료.** `src/lib/copy.ts` 신설: 경로 키(`페이지.섹션.항목`, 공용은 `컴포넌트.항목`, 배열은 인덱스) → 문구. 리터럴 약 150키 + site·sample·services 참조(derived) 키. 4페이지 전부와 공용 컴포넌트(헤더·푸터·플로팅 도크·모바일 CTA바·후기 마퀴·자동 슬라이드·일정 카드·로테이팅 키워드·SNS버튼·견적 폼·브랜드 락업)가 `<T k="…" />`(copy-text.tsx) 또는 `useCopy().get`(placeholder 등 속성)으로 읽는다. 화면 결과 불변(3절).
2. **2단계 `/admin/edit` — 완료.** 페이지 선택(홈·회사소개·서비스·견적) → **실제 페이지 컴포넌트를 그대로 렌더**(미리보기 사본 없음). 루트 레이아웃이 admin 경로에도 헤더·푸터·플로팅·CTA바를 렌더하므로 화면 전체가 실서비스와 같은 모습이고 그 전부가 편집 대상. 텍스트 호버 시 점선, 클릭 시 패널 팝오버 → 입력 즉시 화면 미리보기(로컬 오버라이드), 수정된 키는 주황 점선 유지. 저장 단위는 **"안" 세트**(사용자 확정): 제목 기본 "N안" 자동 증가 + 직접 입력 가능, 안 선택 바에서 [새 안]/기존 안 불러와 이어서 수정 → 덮어쓰기 또는 "새 안으로 저장", 수정 개수 표시. 인증은 기존 proxy.ts basic auth 그대로(`/admin/:path*` 매처가 서버 액션 POST 도 막는다 — 새 인증 없음).
3. **3단계 `/admin/proposals` — 완료.** 목록(안제목·페이지·상태·수정 개수·시각) → 상세(키별 원문 vs 수정안 나란히). 안 단위 상태(제안/채택/반영) 토글 — **"반영" 실행 버튼 없음**(수동 반영 원칙), 상태는 회의 결과 표시 라벨일 뿐 어떤 상태도 실서비스 문구를 바꾸지 않는다. admin/inquiries 표 스타일 재사용.
4. **저장소 `src/lib/copy-drafts.ts` — 완료.** inquiries.ts 이중화 패턴 그대로: Netlify → Blobs(`jiseong-cleaning-copy-drafts` 스토어), 직접 실행 → SQLite(**`.data/copy-drafts.db` — 문의 DB 와 파일 분리**, env `COPY_DRAFT_DB_PATH`). 페이로드 `{title, page, status, createdAt, updatedAt, edits:[{key, original, proposed}]}` — original 은 클라이언트를 믿지 않고 저장 시점 서버 copy.ts 에서 다시 읽는다.

## 2. 변경 파일 요약

**신규 (7)**
- `src/lib/copy.ts` : 문구 단일 저장소(리터럴 + site·sample·services 참조 매핑). 키 규칙·공백 주의는 파일 머리 주석
- `src/lib/copy-drafts.ts` : "안" 세트 저장소 — SQLite/Blobs 이중화, save/get/update/setStatus/list/count
- `src/components/copy-text.tsx` : CopyProvider/useCopy/`<T>` — 실서비스는 래퍼 요소 없이 텍스트 그대로
- `src/components/copy-edit-root.tsx` : 레이아웃 수준 클라이언트 브리지. `usePathname()==="/admin/edit"` 일 때만 오버라이드·클릭 래퍼 주입, 그 외 패스스루. 편집 상태 공유 스토어(useCopyEditStore)
- `src/app/admin/edit/page.tsx` : ?page= 선택 → 실페이지 컴포넌트 렌더 + 패널. force-dynamic
- `src/app/admin/edit/editor-panel.tsx` : 편집 패널(페이지 탭·안 선택 바·제목·팝오버·키 직접 찾기·저장)
- `src/app/admin/edit/actions.ts` : saveCopyDraftAction (검증·제목 자동 번호·새 안/덮어쓰기)
- `src/app/admin/proposals/page.tsx` + `actions.ts` : 게시판 목록·상세·상태 토글(revalidatePath)

**수정 (18)** — 대부분 문구 → `<T>` 전환뿐, 구조·클래스·모션 무변경
- 4페이지(`app/page.tsx`·`about`·`services`·`quote`) + layout.tsx(CopyEditRoot 감싸기 + skip 링크 키)
- 공용 컴포넌트 13개(site-header·site-footer·floating-contact·mobile-cta-bar·quote-form·review-marquee·auto-slider·rotating-words·schedule-card·sns-buttons·brand-mark·page-hero·ui)
- 문구 prop 타입 완화 3곳: `SectionHead.eyebrow`·`PageHero.eyebrow`·`TelButton.tel`·`quote-form Field.label/hint` → ReactNode (렌더 결과 동일)
- `rotating-words.tsx` 의 prop 이 `words: string[]` → **`wordKeys: string[]`** 로 변경(홈 page.tsx 의 상수도 키 배열로)
- 삭제한 파일 없음

## 3. 검증 결과

- `npm run build`: **성공** (13 라우트, TS 통과). ESLint(신규·수정 파일): 오류 0
- 금지어 스윕 `grep -rn "납품\|린넨\|리넨\|고온\|업소용\|취급하지\|천북\|054-621\|배달\|24시간\|고정 시간\|세탁일지" src/` → **0건**
- **텍스트 불변(종료 조건 1)**: 기준 커밋(59b34c0)과 현 HEAD 각각 빌드 → `.next/server/app/{index,about,quote,services}.html` 에서 ①script/style 제거 ②**HTML 주석 제거** ③태그 스트립 ④공백 줄 제거 후 diff → **4페이지 모두 diff 0**.
  - S7 방식에 ② 를 보강한 이유: React 는 인접 텍스트 노드 사이에 하이드레이션 주석 `<!-- -->` 을 넣는데, `{year} 지성크리닝 · {site.parent}` 처럼 여러 식이던 문구가 한 키로 합쳐지면 주석 위치만 달라진다. 주석은 textContent 가 아니므로 제거 후 비교하는 쪽이 "사용자가 보는 텍스트 불변"의 정확한 판정이다(보강 전 유일한 diff 가 푸터 저작권 줄의 주석 분절이었고, 보이는 문자열은 동일했다)
  - 재현: 두 커밋에서 빌드 후 파이썬 4줄 스크립트(위 ①~④)로 추출·diff
- **실동작(종료 조건 2)**: `ADMIN_USER/ADMIN_PASSWORD/COPY_DRAFT_DB_PATH` 지정해 dev 기동, curl 검증
  - `/admin/edit` 인증 없음 401 / basic auth 200
  - 편집 화면 SSR 에 실페이지 + 패널 + 클릭 래퍼(`data-copy-key`) 확인 — 헤더(`header.telLabel`)·푸터(`footer.operator.pre`)·본문(`home.hero.eyebrow`)·플로팅(`floating.kakao`) 전부. about 77 / services 90 / quote 97개
  - **실서비스 `/` 에는 `data-copy-key` 0건** (편집 래퍼 미주입 확인)
  - 서버 액션 직접 POST: 3개 키 수정 저장 → `{"ok":true,"id":1}` → `/admin/proposals` 목록에 "검증용 1안 · 3건 · 제안" 표시 → 상세에 키별 원문("전화 문의") vs 수정안("전화 상담") 나란히 표시
  - 상태 폼 POST(제안→채택) 반영, 덮어쓰기 저장(제목·수정목록 갱신, 상태 채택 유지) 확인. 테스트 DB 는 /tmp 에 두고 삭제 — 트리 클린

## 4. 발견사항 (범위 밖 — 기록만)

- `sample-banner.tsx`(검토용 샘플 경고 배너)는 데이터화하지 않음 — "이 배너가 있으면 운영에 못 올린다"가 목적인 내부 장치라 편집(제안) 대상이 아니라고 판단. 회의에서 편집 대상에 넣기로 하면 키 4개 추가로 끝난다
- aria-label·metadata(title/description/keywords)·JSON-LD 문구도 대상 제외 — 이전 진행분과 같은 기준(화면 텍스트 노드 + 폼 placeholder 만). 필요 시 별도 결정
- admin 페이지들(inquiries·proposals·edit 패널)의 자체 UI 문구는 관리자 전용이라 copy.ts 에 넣지 않음

## 5. 질문 / 판단 보류

- **안의 page 필드 의미**: 편집 오버라이드는 레이아웃 수준 상태라 페이지 탭을 오가며 여러 페이지 키를 한 안에 담을 수 있다(헤더·푸터 같은 공용 키도 어차피 전 페이지 공유). page 는 "저장 시 보고 있던 페이지" 표시로 두었다 — 페이지별로 안을 강제 분리할지는 회의 검토 대상
- **placeholder 류 속성 문구**: 화면 클릭이 불가능해(텍스트 노드가 아님) 패널의 "키로 직접 찾기"(datalist)로 편집하게 했다. 클릭 편집이 꼭 필요하면 입력칸 옆 편집 아이콘 주입 같은 별도 장치 필요
- **제안 문구의 금지어 검사 없음**: 안은 회의용 제안이고 반영은 개발자 수동이라 서버 검증(길이·키 존재)만 넣었다. 저장 시 금지어 경고 표시가 필요하면 결정 요청
- **상태 "반영"**: 지시서의 "채택 표시까지만"과 명세의 "상태(제안/채택/반영)"를 조화 — 세 상태 모두 표시용 라벨로 토글 가능하되 반영 "실행" 기능은 없음. 반영 라벨 자체를 뺄지는 회의 판단

## 6. 다음 세션에 주는 주의

- **새 문구를 추가할 때는 copy.ts 에 키를 만들고 `<T>` 로 읽어라** — 하드코딩하면 편집 대상에서 빠진다. 값 원본이 site/sample/services 면 derived 매핑에 추가(복제 금지)
- **copy.ts 값의 공백이 화면에 그대로 나간다** — JSX 여러 줄 문구를 옮길 땐 공백 축약 결과와 글자 단위로 같아야 한다(quoteForm.consent.detail 의 ` ` 참조). 값을 다듬으면 텍스트 불변이 깨지는 게 정상이니 의도 변경일 때만
- **rotating-words 의 prop 이 `wordKeys` 로 바뀌었다** — 문자열 배열을 넘기면 안 된다. 첫 키가 스크린리더 기본형 원칙은 유지
- **CopyEditRoot 가 레이아웃에서 body 전체를 감싼다** — 실서비스에선 패스스루지만, 이 래퍼를 지우면 /admin/edit 전체가 죽는다. LocalBusinessJsonLd 는 일부러 밖에 뒀다(문구 아님)
- **편집 활성 판정은 `pathname === "/admin/edit"` 정확 일치** — /admin/edit 하위 경로를 만들면 copy-edit-root.tsx 의 판정도 같이 고칠 것. actions.ts 의 EDITABLE_PAGES 와 edit/page.tsx 의 PAGES 도 짝
- **텍스트 불변 재검증 시 HTML 주석 제거를 포함한 방식(3절)을 쓸 것** — S7 원본 방식은 주석 분절 차이를 오탐한다
- 안 데이터는 절대 자동으로 화면에 반영되지 않는다 — 채택안 반영은 copy.ts(리터럴) 또는 원본 파일(derived)을 손으로 고치는 것
- 커밋되지 않은 변경 없음. 병합·푸시 안 함
