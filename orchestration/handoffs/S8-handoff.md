# 핸드오프 — S8: 서비스 페이지 개편(채택된 Claude Design 시안 반영)

- 작성: S8 / 2026-08-28 (빌드·금지어·dev 실측 검증 후 종료)
- 커밋: `b922199` S8: 서비스 페이지 개편 — 채택 시안 반영(핵심 카드·주간 리듬·업종별 신설) (단일 커밋, 브랜치 `work/s8`)

## 1. 완료한 것

지시서 6개 섹션 전부 완료. 시안(`orchestration/designs/Service-시안.dc.html`)의 섹션 순서·구성·문구를 그대로 옮기되, 색상·스타일은 기존 디자인 토큰과 컴포넌트로 치환(S7 원칙과 동일).

1. **PageHero** — 무변경(문구 동일).
2. **핵심 카드(white)** — 시안 구성으로 재편: eyebrow "하나의 서비스, 사업장마다 다른 리듬" + `services[0].summary`("안전한 세탁·살균을 거쳐 약속된 날짜에 수거, 배송해 드립니다.")를 큰 제목(clamp 24→36px)으로 + 우측에 업종 Chip 6개(`targetIndustries` label). hover 리프트(-5px·shadow-raised, 홈 D9와 같은 값). priceNote Alert 현행 유지. 기존 카드의 IconBubble·title·lede 표기는 시안에 없어 제거(데이터 자체는 services.ts에 그대로 남음).
3. **운영 방식(tint)** — 제목 "이렇게 운영합니다" 유지, 카드 3개는 `services[0].points` 재사용(문구 무변). 시안대로 카드별 아이콘 truck·shield·contract 매핑(기존엔 셋 다 linen), hover 리프트, Reveal 시차 120ms(시안값).
4. **신규 주간 리듬(navy)** — SectionHead(tone="dark", align="center", eyebrow "주 간 리 듬", title "사업장의 한 주에 세탁의 박자를 맞춥니다") + S7 `ScheduleCard`를 중앙 max-w-[26.25rem](=420px)로 배치. 배경 글로우 2개는 기존 `jc-glow` 클래스 재사용 + `[animation-duration:16s/20s]`·`[animation-direction:reverse]` 오버라이드(S7 마퀴 34s 오버라이드와 같은 패턴 — reduced-motion 정지 자동 적용).
5. **신규 업종별(white)** — SectionHead "이런 사업장과 함께합니다" + 6카드 그리드(sm 2열·lg 3열). 카드 = Chip(업종 아이콘 + label) + 한 줄 소개. 한 줄 소개 6종은 `lib/sample.ts`에 `industryNotes` 더미로 추가(SAMPLE_CONTENT 게이팅, off면 칩만 남음, 상단 더미 목록 주석 갱신). Reveal 70ms 시차.
6. **마무리 CTA(paper)** — 무변경("확인 후 연락드립니다." + 견적 ButtonLink + 전화 ContactAction — tel: 직결 없음).

## 2. 변경 파일 요약

- `src/app/services/page.tsx` : 시안 섹션 순서대로 재구성(신규 주간 리듬·업종별 섹션 추가, 핵심 카드 재편, 운영 방식 아이콘·리프트). ScheduleCard·industryNotes·targetIndustries import 추가
- `src/lib/sample.ts` : `industryNotes` 더미 추가 + 상단 더미 목록 주석에 한 줄 추가
- `src/lib/services.ts` : 무수정 (지시서의 "필요시 최소 수정" 불필요했음)
- 삭제한 파일 없음

## 3. 검증 결과

- `npm run build`: **성공** (10 라우트, TS 통과)
- ESLint(변경 2파일): 오류 0
- 금지어 스윕 `grep -rn "납품\|린넨\|리넨\|고온\|업소용\|취급하지\|천북\|054-621\|배달\|24시간\|고정 시간\|세탁일지" src/` → **0건**
- `npx next dev -p 3200` 실측: `/services` **200** + "사업장의 한 주에" 문구 존재 확인. 추가로 "이런 사업장과 함께합니다"·"객실 회전에 맞춘 주기"·"기숙사·연수원 침구"·"정기 수거 · 배송 일정"(ScheduleCard) 렌더 확인. 서버 종료 후 트리 클린(AGENTS.md 재생성 변경 없음)

## 4. 발견사항 (범위 밖 — 기록만)

- `services[0].title`·`lede`는 이제 services 페이지에서 표기하지 않는다(핵심 카드가 summary만 씀). 데이터는 about 사업자 정보 등 다른 참조 가능성 때문에 그대로 뒀는데, 실제 잔여 사용처가 없다면 정리 후보(S2 핸드오프 5절의 "임시 제목" 회의 검토와 함께 처리하면 됨).
- 사우나·헬스장 전용 아이콘 부재(S1부터 이관)는 여전함 — 업종별 섹션이 building·office 임시 매핑을 그대로 노출하므로 신규 제작 시 체감 개선 폭이 커졌다.

## 5. 질문 / 판단 보류

- **eyebrow 색**: 시안은 #00AEEF(ci-cyan)인데 흰 배경 위 소형 텍스트로는 대비 미달(globals.css의 sky조차 "아이콘 전용" 주석)이라 기존 SectionHead eyebrow 관례인 `text-brand`로 치환. 시안색을 고집하려면 한 클래스 교체로 가능.
- **시안의 "[문구 확정 필요]" 주황 태그**: 시안은 업종별 한 줄 소개 옆에 확정 대기 태그를 그려 놨으나, 실코드에는 넣지 않음 — 확정 대기 추적은 sample.ts 게이팅+주석(기존 원칙)으로 대신함. 화면 태그가 필요하면 별도 결정.
- **핵심 카드 제목 줄바꿈**: 시안은 `<br>`로 2줄 고정이지만 문구 단일 출처(services.ts summary) 유지를 위해 자연 줄바꿈으로 둠. 특정 지점 개행이 필요하면 summary를 페이지에서 분절해야 함(문구 복제 발생) — 회의 검토 대상.
- **업종별 카드 스타일**: 시안대로 그림자 없는 라인 카드(`border-line` div)로 처리 — 기존 `Card`(shadow-card)와 다른 의도라 컴포넌트 재사용 안 함.

## 6. 다음 세션에 주는 주의

- **`industryNotes`는 sample.ts 더미** — 실값 확정 시 sample.ts 한 곳만 교체(키는 `targetIndustries` label과 일치해야 함). `NEXT_PUBLIC_SAMPLE_CONTENT=off`면 업종별 카드에 칩만 남고 소개 문장이 빠지는 게 정상 동작.
- **ScheduleCard가 홈 히어로와 서비스 페이지 2곳에서 렌더됨** — schedule-card.tsx의 WEEK 배열·문구를 바꾸면 양쪽이 함께 바뀐다. 카드 전체 aria-hidden(예시 화면) 원칙 유지할 것(S7 핸드오프 6절).
- **jc-glow 오버라이드는 임의값 클래스** — globals.css의 `.jc-glow` 기본 주기(14s)를 바꿔도 서비스 페이지 글로우는 16s/20s 오버라이드가 우선. reduced-motion 정지는 클래스 레벨이라 함께 걸린다.
- 운영 방식 아이콘은 `pointIcons` 상수(truck·shield·contract)가 **points 배열 순서에 의존** — services.ts points 순서를 바꾸면 아이콘 짝이 밀린다.
- 커밋되지 않은 변경 없음. 병합·푸시 안 함.
