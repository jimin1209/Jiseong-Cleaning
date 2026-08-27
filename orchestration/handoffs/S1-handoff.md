# 핸드오프 — S1: 문구수정(전역 값·용어 일괄 치환·페이지 문구)

- 작성: S1 / 2026-08-28 (빌드·grep 검증 후 종료)
- 커밋: `6fb6512` S1: 전역 값 교체, 용어 일괄 치환, 홈·회사소개·견적 문구 반영 (단일 커밋, 브랜치 `work/s1`)

## 1. 완료한 것

- **A. 전역 값 `src/lib/site.ts`** — 완료. 전화 010-9828-3637(telHref 포함), 주소 강동면(address·addressShort·mapLinks 2곳), tagline·description 명세 0절 그대로, nav 회사소개→서비스→견적 문의(시설·공정 제거), trustPoints "자체 세탁 시설", targetIndustries 호텔·모텔·펜션·사우나·헬스장·단체시설.
- **B. 하드코딩 정리** — 완료. layout.tsx title 기본값·OG title → "사업장 세탁물 수거·세탁·배송", keywords 재작성(린넨·업소용 제거, 사우나·헬스장 추가), LocalBusinessJsonLd의 천북면·린넨·업소용도 함께 정리. quote metadata는 site.tel 보간으로 재작성(하드코딩 제거). schema.ts:28 주석의 054-621 → 054-000-0000(예시 형식 유지).
- **C. 용어 일괄 치환** — 완료(문장 단위로 수정, sed 미사용·quote-form 한 줄만 sed로 단어 치환). 납품→배송, 린넨·리넨→세탁물, 고온 삭제, 업소용→전문, 원하시는 요일→약속한 날짜, 부정 문장 삭제(홈 적합 업종·회사소개 개요/거래 대상·견적 하단), "고정 시간" 삭제, "세 가지"·"네 단계" 가짓수 삭제, 세탁일지·위생관리 기록 문구 삭제(services.ts kitchen lede·points 항목, reasons 카드). S2 삭제 예정 파일은 손대지 않음(아래 3절 잔존 목록).
- **D. 페이지 문구 교체** — 완료.
  - 홈: 히어로 eyebrow "사업장 세탁 전문"·h1·서브(1-1), 서비스 title(1-2, lede 유지), 이용 절차 "첫 상담부터 배송까지"+lede 삭제(1-3), 적합 업종 title "확인 후 연락드립니다."+부정 문단 삭제+"바로 문의하기" 버튼 추가(1-5), 마무리 CTA(1-9). 시설·공정 섹션은 구조 유지한 채 문구만 규칙에 맞게 정리(천북·업소용·고온·납품 제거) — 섹션 삭제는 S2.
  - services.ts: processSteps 4단계 명세 1-3 표 그대로, 월세탁 summary "고정 시간" 삭제.
  - 회사소개: PageHero 큰 글씨 "(주)지성이엔지 지성크리닝"/작은 글씨 우수조달업체 문구, 개요 title·본문 3단→2단 축약, 페이지 끝 파트너 문구 1회 추가, 거래 대상 부정 제거, Alert 납품→배송, metadata 우수조달업체 반영.
  - 견적: PageHero title "확인 후 연락드립니다.", 연락 카드 라벨 "전화 문의".
  - 헤더: "상담 및 견적 문의" → "전화 문의".
- services/page.tsx title도 1-2 문구로 통일(명세 3절), metadata의 린넨 제거.

## 2. 변경 파일 요약

- `src/lib/site.ts` : 전역 값 전면 교체(0절). targetIndustries 아이콘 임시 매핑 주석 추가
- `src/app/layout.tsx` : title·OG·keywords·구조화 데이터(JsonLd 주소·knowsAbout) 용어 정리
- `src/lib/services.ts` : 3개 서비스 문구 치환, kitchen 세탁일지 point 삭제(3→2개), processSteps 교체, reasons 세탁일지 카드 삭제(6→5개)·배달→배송·린넨→세탁물
- `src/app/page.tsx` : 히어로·서비스·이용 절차·적합 업종·시설 문구·마무리 CTA
- `src/app/about/page.tsx` : 명세 2절 전부 + 취급 필드 임시 갱신
- `src/app/quote/page.tsx` : metadata·PageHero·연락 카드 라벨·하단 부정 문장 삭제
- `src/app/services/page.tsx` : title·metadata 용어 정리
- `src/components/site-header.tsx` : 전화 라벨 "전화 문의"
- `src/components/quote-form.tsx` : region 힌트 납품→배송(문구만, 필드 구조 불변)
- `src/lib/sample.ts` : capacity 라벨 "업소용 세탁 설비"→"전문 세탁 설비", "수거·납품 차량"→"수거·배송 차량"
- `src/lib/schema.ts` : 주석 예시 번호 054-621→054-000 (기능 무변)
- 삭제한 파일 없음

## 3. 검증 결과

- `npm run build`: **성공** (14/14 페이지 생성, TS 통과)
- grep 잔존 (`납품|린넨|리넨|고온|업소용|054-621|천북|고정 시간|세탁일지`) — 전부 S2 삭제 예정 파일만:
  - `src/lib/faq.ts` 9건 (054-621-5002·천북·린넨·세탁일지·"받지 않습니다"·"배달" 포함)
  - `src/app/facility/page.tsx` 21건
  - `src/app/services/[slug]/page.tsx` 2건 ("첫 통화부터 첫 납품까지 네 단계" 등)
  - `src/components/illustration.tsx` 5건, `src/components/price-table.tsx` 1건, `src/lib/pricing.ts` 5건
- 위 외 src/ 잔존 0건 (금지어 "배달"·"24시간"·"취급하지"도 스윕함)

## 4. 발견사항 (범위 밖 — 기록만)

- **워크트리 node_modules 심링크가 빌드를 깨뜨림**: 오케스트레이터가 만든 `wt/s1/website/node_modules` → 메인 레포 절대경로 심링크를 Turbopack이 거부(FATAL: Symlink points out of the filesystem root). **심링크를 `cp -al` 하드링크 복사본으로 교체해 해결**(패키지 추가/삭제 아님, git 추적 대상 아님). S2~S6 워크트리도 같은 조치가 필요할 것.
- faq.ts:29~30에 금지어 "배달" 2건 존재 — S2가 파일째 삭제 예정이라 방치.
- nav에서 /facility 를 제거했지만 라우트·sitemap·footer 링크는 그대로 존재(S2 담당). 홈 서비스 카드의 "취급 품목 보기" → `/services/[slug]` 링크도 유지(S2 담당).

## 5. 질문 / 판단 보류

- **사우나·헬스장 아이콘**: icons.tsx에 없어 임시로 사우나→`building`, 헬스장→`office` 재활용(엉뚱한 의미 매핑 회피). 신규 아이콘 제작 필요(명세 0절 ⚠️, S4 또는 별도). 칩 라벨은 "사우나"로 임시 — "사우나 세탁" 표기 여부 미확정(명세 8-8).
- **layout.tsx 타이틀·keywords**: 명세에 확정 문구가 없어 용어 규칙에 맞춰 재작성 — title "사업장 세탁물 수거·세탁·배송", keywords에 사우나·헬스장 추가/식당·급식소 제거. 회의 검토 필요.
- **히어로 eyebrow** "사업장 세탁 전문" — 명세 1-1의 '안' 그대로, 문구 확정 필요(명세 6절 #7).
- **마무리 CTA(1-9)**: 명세는 title 삭제·lede만 남기라지만 SectionHead 컴포넌트가 title 필수라 "확인 후 연락드립니다."를 title 자리에 넣고 lede 생략. 화면 결과는 명세와 동일.
- **적합 업종 title**(1-5) "확인 후 연락드립니다." — 명세 그대로 적용했으나 eyebrow "이런 곳에 적합합니다"와 조합이 어색할 수 있음. 회의 검토 대상.
- **서비스 임시 제목**: 린넨 제거 과정에서 "숙박시설 세탁"/"호텔 · 모텔 · 펜션 세탁물 세탁"/"주방 · 식당 세탁물"로 임시 재작성 — S2 카드 통합 시 명세 문구("안전한 세탁·살균을 거쳐 약속된 날짜에 수거, 배송해 드립니다.")로 대체될 전제.
- **about 취급 필드**: "사업장 세탁물 정기 수거 · 세탁 · 배송"으로 임시 — S2 통합 서비스 확정 후 갱신 필요.
- **거래 대상 title**: "사업장 고객만 거래합니다" → "사업장 고객과 거래합니다"로 완화(부정·배제 뉘앙스 제거). 명세에 확정 문구 없음.
- **quote PageHero lede**: title이 "확인 후 연락드립니다."가 되면서 기존 lede와 중복 → "급하시면 전화가 가장 빠릅니다."만 남김. 명세 4-2 톤 통일 검토 항목과 연결.

## 6. 다음 세션에 주는 주의

- `processSteps`가 명세 표 그대로 짧은 명사형("사업장 품목·물량 상담" 등)으로 바뀜 — quote 페이지 "접수 후 진행" 카드도 이 배열을 공유하므로 S2/S3에서 문장형으로 되돌리지 말 것.
- `reasons` 배열이 6→5개(세탁일지 카드 삭제), kitchen `points` 3→2개. S2가 강점 섹션·reasons export를 통삭제할 때 그대로 지우면 됨.
- `IndustryIcon` 타입에 `building`·`office`가 포함됨(사우나·헬스장 임시 아이콘). 신규 아이콘 제작 시 site.ts 매핑만 바꾸면 됨.
- nav는 이미 3항목(시설·공정 없음)이지만 `/facility` 라우트·sitemap·footer는 미정리 — S2 범위.
- 워크트리에서 빌드하려면 node_modules 심링크 문제(4절)를 먼저 해결해야 함.
- 커밋되지 않은 변경 없음. 병합·푸시 안 함.
