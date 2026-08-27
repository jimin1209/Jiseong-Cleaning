# 핸드오프 — S2: UI-구조(서비스 통합·페이지 삭제·내비/사이트맵 정리)

- 작성: S2 / 2026-08-28 (빌드·리다이렉트 실동작·grep 검증 후 종료)
- 커밋: `69c890f` S2: 서비스 1건 통합·페이지 삭제·내비/사이트맵 정리 (단일 커밋, 브랜치 `work/s2`)

## 1. 완료한 것

- **A. 서비스 통합 (명세 3절)** — 완료.
  - `lib/services.ts`: services 3건 → 1건(slug `laundry`). 숙박(linen)의 정기 수거·배송, 세탁·살균 point에 월세탁(contract)의 "월 단위 정기 계약" point를 흡수, 주방(kitchen) 삭제. `itemGroups` 필드·`reasons` export·`getService` 제거. forWhom = 호텔·모텔·펜션·사우나·헬스장·단체시설(0절 업종 목록과 일치, 8-5의 식당·월세탁 표기 없음). summary는 명세 확정 문구 "안전한 세탁·살균을 거쳐 약속된 날짜에 수거, 배송해 드립니다." priceNote는 linen 것 유지("단가는 품목·물량·수거 주기에 따라 달라집니다. 물량을 알려주시면 견적을 드립니다." — 판매 강조 없음 판단).
  - `app/services/page.tsx`: 단일 페이지로 재구성 — PageHero(1-2 title·lede) → 통합 카드(제목·summary·lede·업종 칩) + priceNote Alert → 운영 방식 3카드(points) → CTA("확인 후 연락드립니다." + 견적·전화 버튼).
  - `app/services/[slug]/page.tsx`: 상세 페이지 삭제하고 **`permanentRedirect("/services")` 스텁으로 교체** — next.config를 건드리지 않는 라우트 수준 처리. `next start`로 실측: `/services/linen`·`/services/kitchen` → **308 → /services** 확인. (디렉토리를 물리적으로 없애는 대신 스텁을 남긴 것이 지시서 문면과 다르나, "라우트 수준 redirect" 요구를 충족하는 방법이 이것이라 판단 — 아래 5절 참조)
- **B. 삭제 (명세 1·8절)** — 완료.
  - `app/facility/page.tsx` 삭제 (실측 404 확인).
  - 홈 `app/page.tsx`: 강점(1-4)·시설·공정(1-6)·FAQ(1-8) 섹션 통삭제. 서비스 카드 3개 → 통합 1카드(가운데 정렬, max-w-2xl), "취급 품목 보기" 링크 제거(대신 `/services`로 "자세히 보기" — 기존 라벨 재사용). 장애인 표준사업장 섹션 유지 + 인증번호 표기부 제거(배지를 "장애인 표준사업장 인증"만 표기, certification 참조 제거).
  - `lib/faq.ts`·`components/faq-list.tsx`·`components/illustration.tsx`·`components/price-table.tsx`·`lib/pricing.ts` 삭제, import 전부 정리. `components/ui.tsx` 끝의 IllustrationCard 언급 주석도 삭제(grep 종료조건의 주석 포함 조건).
  - `components/sample-banner.tsx` 비표시(8-2): layout에서 import·렌더 제거, 파일과 `SAMPLE_CONTENT` 스위치는 더미 관리용으로 유지(지시서대로).
  - 견적 `app/quote/page.tsx`: FAQ 섹션(id="faq") 삭제, 운영시간 임시값(businessHours) 노출부 제거 → "통화가 어려운 시간에는 아래 폼으로 남겨주시면 회신드립니다." 상시 표기(기존 fallback 문구 재사용). SectionHead·FaqList import 정리.
- **C. 내비·사이트맵·푸터 (명세 5절)** — 완료.
  - `app/sitemap.ts`: facility·services/[slug] 항목 제거 → 4개 라우트(실측 확인).
  - `components/site-footer.tsx`: "안내"에서 시설·공정 제거, 서비스 링크 3→1(`/services`, 라벨은 services[0].short), 운영 문장 → "지성크리닝은 우수조달업체 (주)지성이엔지에서 운영하는 세탁 서비스입니다."
  - nav: S1이 site.ts에서 이미 3항목 처리 — 확인만 함(수정 없음).
- **하지 말 것 준수**: `inquiryItemOptions`·`inquiryIndustryOptions`·`inquiryCycleOptions` 3상수 **원형 그대로 유지**(내용 갱신도 하지 않음 — 아래 5절). 폼·신규 컴포넌트·문구 재창작 없음.

## 2. 변경 파일 요약

- `src/lib/services.ts` : 3건→1건 통합, Service 타입에서 itemGroups 제거, reasons·getService 삭제, 헤더 주석의 faq.ts·단가표 참조 정리. inquiry* 3상수 불변
- `src/app/services/page.tsx` : 통합 단일 페이지로 전면 재작성
- `src/app/services/[slug]/page.tsx` : permanentRedirect("/services") 스텁으로 전면 교체
- `src/app/page.tsx` : 3개 섹션 통삭제, 서비스 통합 1카드, 인증번호 제거, import 정리
- `src/app/layout.tsx` : SampleBanner import·렌더 제거
- `src/app/quote/page.tsx` : FAQ 섹션 삭제, 운영시간 → 폼 안내 문구, import 정리
- `src/app/sitemap.ts` : facility·서비스 상세 제거, services import 제거
- `src/components/site-footer.tsx` : 시설·공정 링크 제거, 서비스 링크 단일화, 우수조달업체 문구
- `src/components/ui.tsx` : illustration 언급 주석만 삭제(코드 불변)
- 삭제: `src/app/facility/page.tsx`, `src/lib/faq.ts`, `src/components/faq-list.tsx`, `src/components/illustration.tsx`, `src/components/price-table.tsx`, `src/lib/pricing.ts`

## 3. 검증 결과

- `npm run build`: **성공** (10 라우트, TS 통과. `/services/[slug]`만 동적 — redirect 스텁이라 정상)
- `next start` 실측: `/services/linen`·`/services/kitchen` → 308 → `/services`(200), `/facility` → 404, sitemap.xml 4개 라우트만.
- `grep -rn "facility\|faq\|price-table\|pricing\|illustration" src/` → **0건** (주석 포함. sample-banner 정의부·sample.ts의 businessHours 등 유지 지시 파일만 잔존하며 위 패턴에는 안 걸림)
- **S1 잔존 금지어 재스윕**: `grep -rn "납품\|린넨\|리넨\|고온\|업소용\|취급하지\|천북\|054-621\|배달\|24시간\|고정 시간\|세탁일지" src/` → **0건** (S1 핸드오프 3절의 잔존 6파일이 전부 삭제·교체됨)

## 4. 발견사항 (범위 밖 — 기록만)

- `app/about/page.tsx:160~165`가 `certification`(인증번호 임시값 "제0000호")을 아직 표기함. 명세 1-7은 홈 기준이라 홈만 처리했는데, 인증번호 비표기 방침이 회사소개에도 적용돼야 한다면 별도 정리 필요(오케스트레이터 판단).
- about의 사업자 정보 카드 "취급" 필드는 S1 임시값("사업장 세탁물 정기 수거 · 세탁 · 배송") — 통합 서비스 확정 문구가 정해지면 갱신 필요(S1 핸드오프에서 이관된 항목).
- `lib/sample.ts`의 `businessHours`·`capacity`·`certification`은 이제 사용처가 quote(businessHours는 이번에 제거)·about(certification)뿐이거나 0곳. sample.ts는 더미 단일 관리 파일이라 삭제하지 않고 그대로 둠.
- `components/icons.tsx`의 kitchen·contract 아이콘, Service 타입의 icon 유니언("linen"|"kitchen"|"contract")은 남겨 둠 — 아이콘 세트 정리는 신규 아이콘 제작(사우나·헬스장)과 함께 하는 게 맞다고 판단.

## 5. 질문 / 판단 보류

- **[slug] 처리 방식**: 지시서는 "`app/services/[slug]/` 삭제"라 했지만, next.config 없이 라우트 수준에서 `/services/linen` 등을 redirect하려면 그 경로를 받는 라우트가 있어야 함 → **[slug]/page.tsx를 permanentRedirect(308) 스텁으로 교체**하는 방식을 택함(상세 페이지 자체는 삭제됨). 정의되지 않은 슬러그(`/services/아무거나`)도 전부 `/services`로 감. 404가 낫다면 오케스트레이터가 스텁에 슬러그 검사 추가 필요.
- **통합 서비스 제목**: 명세에 확정 제목이 없어 `title: "사업장 세탁물 수거 · 세탁 · 배송"`(S1이 잡은 layout 타이틀 계열), `short: "사업장 세탁물 정기 세탁"`(푸터 링크 라벨), `lede`는 확정 tagline 문장을 재사용. 전부 임시 — 회의 검토 대상(명세 6절 #7).
- **inquiryIndustryOptions 내용 갱신 안 함**: 지시서가 "허용"이라 했지만, `lib/schema.ts`가 `z.enum(inquiryIndustryOptions)`으로 검증에 쓰고 있어 내용을 바꾸면 S3의 폼·스키마 개편과 충돌 위험 → S3가 industry 필드 자체를 삭제할 예정이므로 건드리지 않는 쪽을 택함.
- **홈 통합 카드의 "자세히 보기" 링크**: 지시서에 없는 요소지만 기존 카드 구조(링크 포함)를 유지하며 라벨만 기존 services 페이지의 "자세히 보기"를 재사용. 카드 없이 소개형으로 가려면 이 링크만 지우면 됨.
- **priceNote 유지 확정**: "판매 강조 없는 톤 확인" 지시에 따라 유지로 판단했으나 명세 6절 #6(단가표 처리)은 여전히 확인 대기 — 숨김 결정이 나면 services 페이지의 Alert 한 블록만 지우면 됨.

## 6. 다음 세션에 주는 주의

- **services 배열은 이제 1건**(slug `laundry`). `services[0]` 또는 map으로 접근. `getService`·`reasons`·`itemGroups`는 없어짐 — import하면 빌드 깨짐.
- `lib/schema.ts`·`components/quote-form.tsx`는 여전히 inquiry* 3상수를 참조(S3 범위). S2는 이 5레이어를 일절 건드리지 않았음.
- 홈·quote가 공유하는 `processSteps`는 S1 상태 그대로(짧은 명사형) — 되돌리지 말 것.
- 샘플 배너는 layout에서만 뺀 것 — `sample-banner.tsx`와 `SAMPLE_CONTENT`는 살아 있으니 "미사용 파일"로 오인해 지우지 말 것(더미 관리용 유지 지시).
- quote 페이지에 `id="faq"` 앵커가 사라짐 — 외부에서 `/quote#faq`로 링크하지 말 것(홈의 해당 링크는 함께 삭제됨).
- 워크트리 node_modules는 하드링크 복사본으로 이미 조치돼 있었음(S1 발견사항의 심링크 문제 재발 없음).
- 커밋되지 않은 변경 없음. 병합·푸시 안 함.
