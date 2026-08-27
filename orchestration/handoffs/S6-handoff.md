# 핸드오프 — S6: 검증·QA (명세 대조 및 실행 확인)

- 작성: S6 / 2026-08-28 (A·B·C 전 항목 수행 후 종료)
- 커밋: 없음 — 경미한 수정(S6-fix) 대상에 해당하는 한 줄짜리 명백한 버그를 발견하지 못함. 워크트리 클린(`git status` 무변경, HEAD `b26a5b7`)

## 1. 완료한 것

지시서의 A(기계 검증)·B(명세 대조)·C(실행 확인) 전 항목 수행. 코드 수정 없음(발견만 기록).

### A. 기계 검증 — 전부 PASS

| # | 항목 | 결과 | 비고 |
|---|---|---|---|
| A-1 | `npm run build` | **PASS** | Next 16.3.1, 10 라우트, TS 통과, 오류 0 |
| A-2 | 금지어 스윕 (납품·린넨·리넨·고온·업소용·취급하지 않·받지 않습니다·24시간·천북·054-621·고정 시간·세탁일지) | **PASS** | src/ 전체 0건 |
| A-3 | `site.ts`에 010-9828-3637·강동면 | **PASS** | tel L65, address·addressShort·mapLinks 2곳(총 4곳 강동면) |
| A-4 | facility·[slug]·faq.ts·illustration·price-table·pricing 부재 + 참조 0 | **PASS(비고)** | facility·faq.ts·illustration.tsx·price-table.tsx·pricing.ts 부재, 참조 grep 0건. 단 `app/services/[slug]/page.tsx`는 **존재** — S2가 의도적으로 남긴 `permanentRedirect("/services")` 스텁(S2 핸드오프 5절 기록, 상세 페이지 코드는 소멸). 지시서 문면과 다르나 구 URL 처리 요구를 충족하는 유일한 라우트 수준 방법이라 PASS 판정 |
| A-5 | sitemap에 facility·[slug] 없음 | **PASS** | `/`·`/services`·`/about`·`/quote` 4개만 |

### B. 명세 대조 (절 번호 순)

| 절 | 항목 | 결과 | 근거 |
|---|---|---|---|
| 0 | tel·telHref·address·addressShort·mapLinks·tagline·description | **PASS** | site.ts 명세 표와 전부 일치 |
| 0 | nav 회사소개→서비스→견적 문의 (시설·공정 삭제) | **PASS** | site.ts L87~91 |
| 0 | trustPoints "자체 세탁 시설" (지역명 없음) | **PASS** | |
| 0 | targetIndustries 호텔·모텔·펜션·사우나·헬스장·단체시설 | **PASS(보류 1건)** | 목록 일치. 사우나→`building`·헬스장→`office` **임시 아이콘**(신규 제작 미완, S1부터 이관 중). 라벨 "사우나" 표기는 명세 8-8 미확정 사항 |
| 1-1 | 히어로 h1·서브·CTA (전화 010) | **PASS** | h1은 D5 로테이션으로 3분절이나 기본형 문장 완성 확인(C 참조). eyebrow "사업장 세탁 전문"은 명세 '안' 그대로(6절 #7 확정 대기) |
| 1-2 | 서비스 title·카드 1개 통합·"취급 품목 보기" 삭제·"고정 시간" 삭제 | **PASS** | 카드 summary 명세 확정 문구. 카드에 "자세히 보기"(→/services) 링크가 있음 — S2 판단 보류 항목, 상세 페이지가 아닌 통합 페이지로 가므로 위반 아님 |
| 1-3 | 절차 "첫 상담부터 배송까지" + 4단계 명세 표 그대로 | **PASS** | processSteps 상담/수거/세탁/배송, "4단계" 단어 없음, lede 없음 |
| 1-4 | 강점 섹션 통삭제 (reasons export 제거) | **PASS** | services.ts에 reasons 없음 |
| 1-5 | 적합 업종 title "확인 후 연락드립니다." + 부정 문구 삭제 + "바로 문의하기" 버튼 | **PASS** | |
| 1-6 | 시설·공정 섹션 통삭제 | **PASS** | |
| 1-7 | 표준사업장 유지 + 전단지 lede + 인증번호 비표기 | **PASS** | 홈·회사소개 모두 "장애인 표준사업장 인증"만, 번호 없음 |
| 1-8 | FAQ 통삭제 (홈·quote) | **PASS** | |
| 1-9 | 마무리 CTA "확인 후 연락드립니다." | **PASS** | SectionHead title 필수 제약으로 title 자리에 배치(S1 기록, 화면 결과 동일) |
| 2 | 회사소개 PageHero 큰/작은 글씨 | **PASS** | title "(주)지성이엔지 지성크리닝" / lede "우수조달업체 …" |
| 2 | 개요 title 큰 글씨 + 본문 2단 축약(부정·품목·지역·업소용 없음) | **PASS** | |
| 2 | 마무리 파트너 문구 페이지 끝 1회 | **PASS** | "'안전한 시공 및 점검으로 신뢰받는 기업' (주)지성이엔지의 파트너 지성크리닝입니다." — about 페이지에서 "파트너" 등장 1회뿐임을 grep 확인 |
| 2 | 거래 대상 부정 제거·Alert 배송 | **PASS** | |
| 3 | services[] 1건 통합·itemGroups 삭제·[slug] 리다이렉트·페이지 title 1-2 동일 문구·forWhom 0절 일치 | **PASS** | priceNote 유지는 명세 6절 #6 확정 대기(S2 판단대로 노출 중) |
| 4-1 | quote PageHero "확인 후 연락드립니다."·metadata 새 번호(보간)·FAQ 삭제·연락 카드 "전화 문의" | **PASS** | 운영시간 임시값 노출부는 제거되고 폼 안내 문구로 대체(블로킹 #5 해소 방식) |
| 4-2 | 폼 필드 최종안 (7필드: company·contactName·phone·email·region·message·consent) | **PASS** | 5레이어(quote-form·schema·actions·inquiries·admin/mail) 모두 industry·items·volume·cycle 없음. 라벨 성함·주소, 빨간 `*` 유지, 동의문 수집항목 갱신 |
| 4-2 | DB 컬럼 보존 | **PASS** | inquiries.ts CREATE TABLE에 industry(NOT NULL)·items·volume·cycle 컬럼 유지, INSERT는 빈 문자열 — 마이그레이션 없음 |
| 5 | 헤더 "전화 문의" + nav 반영 | **PASS** | |
| 5 | 푸터 시설·공정 제거·서비스 링크 1개·우수조달업체 문구 | **PASS** | |
| 8-1 | 세탁일지 문구 0건 | **PASS** | A-2에 포함 |
| 8-2 | 상단 빨간 임시값 배너 비표시 | **PASS** | layout에서 SampleBanner 미렌더(컴포넌트·스위치는 더미 관리용 유지) |
| 8-5 | forWhom 식당·월세탁 표기 없음 | **PASS** | |
| 8-6 | 자동 슬라이드 (현 확정 2장 + 자리 2장, 자동 넘김) | **PASS** | auto-slider 6초 자동, 수동 조작·reduced-motion 대응. 지성이엔지 원본 2장은 자료 수급 대기(자리 슬라이드, 샘플 모드 전용) |
| 9-1 | 후기 마퀴 방향 = 왼쪽 | **PASS** | `@keyframes jc-marquee { to { translateX(-50%) } }` — 왼쪽 흐름, 카드 2회 렌더 이음새, hover·reduced-motion 정지 |
| 9-3~9-5 | 기기별 분기 매트릭스 | **PASS(발견 1건)** | 명세의 "적용 대상 코드" 열거 목록(헤더·홈 히어로/CTA·mobile-cta-bar·quote 연락 카드·푸터·플로팅) 전부 분기 적용 확인. SMS는 PC 비표시(`lg:hidden`, 2026-08-28 확정 반영). 단 열거 목록 밖의 about·services CTA 전화 버튼은 미분기 — 아래 4절 발견사항 ① |
| 9-6 | SNS 버튼 (푸터 + 후기 섹션 부근, 준비 중 안내) | **PASS** | snsLinks 전부 null → 클릭 시 준비 중 안내 |
| 9-7 | 더미 우선 노출 + 더미 목록 추적 | **PASS** | sample.ts 상단 주석에 더미 9종 목록·확정 대기 사유 명시, 전부 한 파일 관리 |
| 9-8 | 플로팅 5채널 (전화·폼·SMS·카카오톡·챗봇) | **PASS(변경 반영)** | 5채널 전부 존재. 카카오톡·챗봇은 준비 중 안내 + /quote 유도(9-7 충족). 형태는 명세의 "런처 펼침"이 아닌 **상시 노출 도크**(PC 우측 중앙 세로 탭·모바일 아이콘 도크) — 커밋 `a9e6741` "사용자 지시"로 명세 이후 변경된 확정사항이라 위반 아님. 위치도 같은 지시로 8-4의 "오른쪽 아래"(PC)에서 우측 중앙으로 변경됨 |

### C. 실행 확인 — 전부 PASS

`npx next dev -p 3100` 기동 후 curl 실측, 확인 후 서버 종료(워크트리 무변경 확인).

| 항목 | 결과 |
|---|---|
| `/` `/about` `/services` `/quote` | 전부 **HTTP 200** |
| `/` 핵심 문구 | "수거부터 배송까지" · "사업장 세탁물을" · "대신 관리해 드립니다" 전부 존재 (h1이 D5 로테이션으로 3분절이지만 기본형 문장 완성) |
| `/about` 핵심 문구 | "우수조달업체" · "파트너" 존재 |
| `/quote` 핵심 문구 | "확인 후 연락드립니다" 존재 |
| 구 URL `/services/linen` | **308 → `/services`** (추적 최종 200) — permanentRedirect 스텁 정상 동작 |
| (추가) `/facility` | 404 |

## 2. 변경 파일 요약

없음 — 검증 전용 세션, 코드 무수정. `S6-fix` 커밋 대상(오타·깨진 import 급 한 줄 버그) 미발견.

## 3. 검증 결과

- `npm run build`: **성공** (위 A-1)
- 전 검증 명령·결과는 1절 표에 병기. 재현 명령:
  - A-2: `grep -rn "납품\|린넨\|리넨\|고온\|업소용\|취급하지 않\|받지 않습니다\|24시간\|천북\|054-621\|고정 시간\|세탁일지" src/`
  - A-4: `grep -rn "facility\|faq\|price-table\|pricing\|illustration" src/`
  - C: `npx next dev -p 3100` 후 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/<경로>`

## 4. 발견사항 (수정하지 않고 기록만)

① **about·services 페이지 CTA의 전화 버튼이 기기별 분기 미적용** — `app/about/page.tsx:224`와 `app/services/page.tsx:111`이 `ButtonAnchor href={site.telHref}` 직결이라 PC에서 죽은 `tel:` 링크가 된다. 명세 9-3의 "적용 대상 코드" 열거 목록에는 두 파일이 없어 문면상 위반은 아니나, 매트릭스 원칙("전화하기: PC → /quote")과 어긋난다. `about/page.tsx:90`(사업자 정보 카드 대표전화)도 동일 패턴. **수정은 한 줄이 아니라(ContactAction 교체 + import) S6-fix 범위 밖 — 담당 제안: S4 계열 보완 세션 또는 오케스트레이터 직접 수정** (S4 핸드오프 6절의 "새 전화 버튼은 contact-action.tsx를 쓸 것" 원칙을 기존 버튼 2곳에 소급 적용하는 일).
   - 재현: PC 뷰포트에서 `/about`·`/services` 하단 CTA의 전화번호 버튼 클릭 → 아무 일도 안 일어남(브라우저가 tel: 무시).
② admin/inquiries 헤더의 전화 링크도 `tel:` 직결이나, 관리자 내부 화면이라 소비자 대상 매트릭스 적용 대상이 아니라고 판단 — 기록만.

## 5. 질문 / 판단 보류 (기존 미확정 항목의 현황 정리 — 신규 없음)

- 명세 6절 확인 대기 중 코드에 아직 노출되는 것: **priceNote**(#6, services 페이지 Alert로 노출 중), **사업자 정보 임시값**(#2, SAMPLE_CONTENT 게이팅), **SMS 문구**(#3, 더미), **후기 문구**(#4, 더미 5건), **SNS 링크**(#8·9-6, null), **지성이엔지 슬라이드 2장**(8-6, 자리 표시). 전부 sample.ts 단일 관리 + 준비 중/샘플 게이팅이라 명세 9-7 원칙 충족.
- 사우나·헬스장 신규 아이콘(명세 0절 ⚠️)과 칩 라벨 "사우나 세탁" 표기(8-8)는 S1부터 이관된 미확정 — 어느 세션도 해소하지 않음.
- [slug] 스텁 존재(A-4 비고): 지시서 문면("부재")대로 물리 삭제하려면 next.config redirect가 필요한데 RULES 6절이 next.config 변경을 금지 — 현 스텁 유지가 규정 정합. 물리 삭제를 원하면 오케스트레이터 승인 하에 next.config 처리로 전환해야 함.

## 6. 다음 세션에 주는 주의

- 통합 브랜치 반영 시 남은 실작업은 발견사항 ①(전화 버튼 2~3곳 ContactAction 소급)뿐 — 이외 A/B/C 전 항목 통과라 초안 공유 가능 상태.
- dev 서버 실측은 포트 3100에서 했고 종료함. 워크트리에 커밋되지 않은 변경 없음. 병합·푸시 안 함.
