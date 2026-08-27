# 핸드오프 — S4: UI-신규(플로팅 위젯·후기 마퀴·자동 슬라이드·SNS·기기별 분기)

- 작성: S4 / 2026-08-28 (빌드·금지 용어 grep 검증 후 종료)
- 커밋: `ba01832` S4: 플로팅 문의 위젯·후기 마퀴·자동 슬라이드·SNS 버튼·기기별 버튼 분기 신규 (단일 커밋, 브랜치 `work/s4`)

## 1. 완료한 것

- **A. 플로팅 통합 문의 위젯 (명세 9-8·8-4)** — 신규 `components/floating-contact.tsx`, `layout.tsx`에서 전 페이지 렌더.
  - 오른쪽 아래 원형 런처(말풍선 아이콘) → 클릭 시 채널 5개 패널: ① 전화(기기별 분기) ② 견적 문의 폼(/quote) ③ 문자 문의(기기별 분기) ④ 카카오톡 채널 ⑤ 챗봇 상담.
  - 카카오톡·챗봇은 행에 "준비 중" 태그를 상시 표기하고, 클릭 시 안내 문구("…준비 중입니다. 견적 문의를 이용해 주세요.") + "견적 문의로 이동" 버튼이 6초간 표시(명세 9-7 더미 우선 노출). Esc 로 닫힘, 접으면 안내도 소거.
  - 모바일에선 하단 CTA바 위 `bottom-[calc(5.25rem+safe-area)]`, lg 이상 `bottom-6` — CTA바와 겹치지 않음.
- **B. 기기별 버튼 분기 (명세 9-3~9-5)** — 신규 `components/contact-action.tsx`. JS UA 스니핑 없이 **CSS `lg:` 분기**(두 요소 렌더, `display:contents` 래퍼 `DeviceSplit`).
  - export: `smsHref`(번호는 site.tel에서 파생 + sample.ts 더미 문구 URL 인코딩), `DeviceSplit`, `ContactAction`(버튼형), `ContactSplitLink`(비버튼형).
  - 적용: 홈 히어로 전화 버튼·마무리 CTA 전화 버튼(page.tsx → ContactAction), 헤더 전화 영역(site-header.tsx → ContactSplitLink), 푸터 대표전화(site-footer.tsx → ContactSplitLink), 견적 연락 카드(quote/page.tsx → DeviceSplit, 아래 5절 참조), 플로팅 위젯 내부.
  - `mobile-cta-bar.tsx`는 **무변경** — `lg:hidden`이라 항상 모바일이며 기존 tel:이 매트릭스와 일치(아래 5절).
- **C. 후기 마퀴 (명세 4-3·9-1)** — 신규 `components/review-marquee.tsx` + globals.css `jc-marquee` 키프레임. 견적 페이지 폼 섹션 아래 "이용 후기" 섹션으로 배치. 카드 목록 2회 렌더 후 트랙 -50% 이동으로 무한 왼쪽 루프(42초/바퀴), 양끝 마스크 페이드, hover 시 정지, `prefers-reduced-motion` 시 정지, 뒤쪽 절반 aria-hidden. 더미 후기 5개는 sample.ts(`reviews`) — 익명 "김○○님 · 펜션" 형식, 지시서 예문 2개 + 용어 규칙에 맞는 3개.
- **D. 자동 슬라이드 배너 (명세 8-6)** — 신규 `components/auto-slider.tsx`(클라이언트, 순수 React/CSS). **홈 히어로 바로 아래** 배치(지시 기본값 — 질문 6절). 6초 자동 넘김, 화살표·점 수동 조작, hover/focus/reduced-motion 시 자동 넘김 정지. 슬라이드 4장은 sample.ts(`slides`): ①지성크리닝(태그라인 재사용, navy) ②장애인 표준사업장(전단지 확정 문구 재사용, tint) ③④지성이엔지 콘텐츠 **자리**(brand, "원본 배너 자료를 받은 뒤 이 자리에 넣습니다"). 전부 단색 배경+텍스트, `image: string | null` 필드로 이미지 교체 가능 구조(경로를 넣으면 배경으로 깔림).
- **E. SNS 버튼 (명세 9-6)** — 신규 `components/sns-buttons.tsx`. 인스타그램·네이버 블로그 아이콘 버튼, 링크는 sample.ts `snsLinks`(전부 null). null 이면 클릭 시 "SNS 채널은 준비 중입니다" 4초 표시. 배치: 푸터 브랜드 칼럼(다크 톤) + 견적 후기 섹션 하단.
- **F. 더미 추적** — sample.ts 상단 주석에 "이 파일이 관리하는 더미 목록" 절 신설, 기존 5종 + 신규 4종(smsBody·reviews·slides 자리 2장·snsLinks)을 확정 대기 사유와 함께 명시.

## 2. 변경 파일 요약

**신규 컴포넌트 (5)**
- `src/components/contact-action.tsx` : 기기별 분기 공용(DeviceSplit·ContactAction·ContactSplitLink·smsHref)
- `src/components/floating-contact.tsx` : 플로팅 통합 문의 위젯 (클라이언트)
- `src/components/auto-slider.tsx` : 자동 슬라이드 배너 (클라이언트)
- `src/components/review-marquee.tsx` : 후기 마퀴 (서버)
- `src/components/sns-buttons.tsx` : SNS 버튼 + 준비 중 안내 (클라이언트)

**수정 (9)**
- `src/lib/sample.ts` : 더미 목록 주석 + smsBody·Review/reviews·Slide/slides·snsLinks 추가. site.ts import(태그라인·상호 재사용)
- `src/app/globals.css` : `.jc-marquee` 유틸 + `@keyframes jc-marquee` + reduced-motion 정지
- `src/app/layout.tsx` : FloatingContact 전역 렌더
- `src/app/page.tsx` : 히어로 아래 슬라이드 섹션 추가, 히어로·마무리 CTA 전화 버튼 → ContactAction (ButtonAnchor import 제거)
- `src/app/quote/page.tsx` : 연락 카드 전화 DeviceSplit, 후기 섹션(마퀴+SNS) 추가
- `src/components/site-header.tsx` : 전화 영역 → ContactSplitLink (PC=lg↑ /quote, md~lg tel:)
- `src/components/site-footer.tsx` : 대표전화 → ContactSplitLink, SNS 버튼 추가
- `src/components/icons.tsx` : chevronLeft·chat·sms·bot·instagram·blog 6종 추가 (기존 스트로크 규칙 준수)
- `src/components/ui.tsx` : `ButtonLook` 타입 export 로 변경 (한 단어, 코드 불변)

## 3. 검증 결과

- `npm run build`: **성공** (10 라우트, TS 통과)
- 금지 용어 grep (`납품|린넨|리넨|고온|업소용|취급하지|천북|054-621|배달|24시간|고정 시간|세탁일지`) → src/ 전체 **0건** (신규 컴포넌트·더미 문구 포함)
- 더미 후기·슬라이드 문구도 용어 규칙 준수 확인(배송·약속한 날짜 계열만 사용, 부정 표현 없음)

## 4. 발견사항 (범위 밖 — 기록만)

- 커밋 `fab9bc6`(오케스트레이터)이 회사소개 인증번호 표기를 이미 제거해 둠 — S2 핸드오프 4절의 이관 항목은 해소된 상태였음.
- 워크트리 node_modules 는 하드링크 복사본으로 이미 조치돼 있어 빌드 문제 없음(S1 발견사항 재발 없음).

## 5. 질문 / 판단 보류

- **슬라이드 배치**: 지시서 D의 기본값대로 **홈 히어로 아래** 단독 섹션(white, 좁은 패딩)으로 넣음. 회사소개로 옮기려면 page.tsx의 "자동 슬라이드 배너" 블록만 이동하면 됨. **회의 확정 필요**. 흰 바탕 지시(명세 8-7)가 슬라이드 배경 건이라면 현재 단색(navy/brand/tint) 구성이라 해당 없음 — 대상 확인 필요.
- **지성이엔지 콘텐츠 2장**: 어떤 콘텐츠 2장이 확보됐는지(블랙아이스·소화제 등) 자료가 없어 임의 창작하지 않고 "콘텐츠 자리 ①②" 표기 자리 슬라이드로 처리(샘플 모드에서만 노출). 원본 이미지·문구 수급 후 sample.ts `slides`만 교체.
- **분기 기준점 lg**: 헤더 전화 영역이 원래 `md:block`이라, md~lg(태블릿)는 모바일 취급(tel:)으로 통일함. 매트릭스가 "PC"의 경계를 정의하지 않아 lg(1024px)로 잡음 — 전 적용 지점 동일 기준.
- **견적 페이지 연락 카드의 PC 동작**: 매트릭스대로면 /quote 이동인데 이미 /quote 페이지라 무의미 → PC 는 링크 없는 번호 표기, 모바일만 tel:. 회의 검토 대상.
- **mobile-cta-bar 에 SMS 버튼 미추가**: 명세 5의 "SMS 버튼 추가 후보 위치"이나, 버튼 3개는 좁은 화면에서 과밀하고 플로팅 위젯(모바일에도 노출)이 문자 문의를 담당하므로 기존 2버튼 유지. 필요 시 별도 결정.
- **후기 섹션 제목 "이용 후기"**: 명세에 확정 문구가 없어 중립 라벨로 임시 처리. 후기 문구와 함께 회사 초안(G4) 수령 시 교체.
- **네이버 블로그 아이콘**: 브랜드 로고 대신 글쓰기 픽토그램으로 임시 제작(아이콘 세트의 스트로크 규칙 준수, 브랜드 로고 무단 사용 회피). 카카오톡 채널 행도 일반 말풍선 아이콘. 정식 브랜드 아이콘 도입 여부는 채널 개설 시 결정.
- **SAMPLE_CONTENT 게이팅**: reviews(off 면 후기 섹션째 비표시)·smsBody(off 면 빈 문구로 문자 앱만 열림)·지성이엔지 자리 슬라이드 2장(off 면 확정 문구 슬라이드 2장만 남음)을 기존 sample.ts 원칙대로 스위치에 연동. 사우나·헬스장 신규 아이콘(S1 이관 항목)은 이번 범위에 없어 미제작 — 임시 매핑 유지 중.

## 6. 다음 세션에 주는 주의

- **전화·SMS 버튼을 새로 만들 때는 `contact-action.tsx`를 쓸 것** — `ButtonAnchor href={site.telHref}` 직결은 분기 규칙(명세 9-3~9-5) 위반이 된다. SMS 번호는 site.tel 파생이라 번호 변경 시 자동 반영.
- `DeviceSplit`은 두 요소를 모두 렌더한다 — 내부에 무거운 콘텐츠·중복 id 를 넣지 말 것.
- 플로팅 위젯·모바일 CTA바 모두 z-50 고정 — 새 고정 요소를 추가하면 우하단(모바일은 하단 5.25rem 위)과 겹침 검토 필요.
- 후기·슬라이드·SMS 문구·SNS 링크의 실값 교체는 **sample.ts 한 파일**에서 끝난다(컴포넌트는 손댈 필요 없음). 상단 더미 목록 주석도 함께 갱신할 것.
- `ui.tsx`의 `ButtonLook` 타입이 export 로 바뀜(기능 무변). icons.tsx에 6종 추가 — 스트로크 1.8·24px 그리드 규칙 유지할 것.
- globals.css 의 `jc-marquee` 는 "카드 목록 2회 렌더 + -50% 이동" 전제 — 마퀴 카드 폭·간격을 바꿔도 되지만 목록을 1회만 렌더하면 이음새가 끊긴다.
- 커밋되지 않은 변경 없음. 병합·푸시 안 함.
