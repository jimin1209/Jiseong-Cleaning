/**
 * 화면 문구 단일 저장소 (명세 9-2 · 관리자 인라인 편집의 기반).
 *
 * 페이지·컴포넌트에 하드코딩돼 있던 문구를 경로 키로 데이터화했다.
 * 컴포넌트는 문자열을 직접 쓰지 않고 <T k="…" /> (copy-text.tsx) 로 읽는다 —
 * 편집 모드(/admin/edit)가 이 키를 기준으로 오버라이드·클릭 편집을 주입한다.
 *
 * ⚠️ 값 단일 출처 원칙:
 *   - 상호·전화·주소·업종은 site.ts, 더미는 sample.ts, 서비스 데이터는 services.ts 가
 *     원본이다. 여기서는 그 값을 **참조**해 키에 매핑할 뿐 복제하지 않는다.
 *   - 전화번호·주소 같은 "값"({site.tel} 등)은 문구가 아니므로 키로 만들지 않는다.
 *   - 문구를 고칠 때: 리터럴은 이 파일에서, 참조 값은 원본 파일에서 고친다.
 *
 * ⚠️ 용어 규칙(RULES.md 3항)은 이 파일의 값에도 그대로 적용된다 — 원문 이동만, 변형 금지.
 *
 * 키 규칙: `페이지.섹션.항목` (공용 컴포넌트는 `컴포넌트.항목`).
 * 배열 참조는 인덱스를 붙인다(`process.0.title`). JSX 여러 줄 문구는
 * JSX 공백 축약 결과(줄바꿈 → 공백 1개)와 글자 단위로 같아야 한다.
 */

import { industryNotes, reviews, slides } from "./sample";
import { processSteps, services } from "./services";
import { nav, site, targetIndustries, trustPoints } from "./site";

/* ═══════════════ 리터럴 — 컴포넌트에서 옮겨온 하드코딩 문구 ═══════════════ */

const literals: Record<string, string> = {
  /* ── 전역 레이아웃 ── */
  "layout.skip": "본문으로 건너뛰기",

  /* ── 헤더 (site-header.tsx) ── */
  "header.telLabel": "전화 문의",
  "header.quoteCta": "견적 문의",

  /* ── 푸터 (site-footer.tsx) ── */
  "footer.telLabel": "대표전화",
  "footer.operator.pre": "지성크리닝은 우수조달업체",
  "footer.operator.post": "에서 운영하는 세탁 서비스입니다.",
  "footer.services.heading": "서 비 스",
  "footer.info.heading": "안 내",
  "footer.info.0": "회사소개",
  "footer.info.1": "장애인 표준사업장",
  "footer.info.2": "견적 문의",
  "footer.biz.representative": "대표자",
  "footer.biz.registration": "사업자등록번호",
  "footer.biz.mailOrder": "통신판매업",
  "footer.biz.fax": "팩스",
  "footer.sampleNotice": "사업자 정보는 확인 전 임시값입니다",

  /* ── 모바일 하단 CTA 바 (mobile-cta-bar.tsx) ── */
  "mobileCta.telLabel": "전화 문의",
  "mobileCta.quoteLabel": "견적 문의",

  /* ── 플로팅 문의 도크 (floating-contact.tsx) ── */
  "floating.tel": "전화 문의",
  "floating.quote": "견적 문의",
  "floating.sms": "문자 문의",
  "floating.kakao": "카카오톡",
  "floating.bot": "챗봇 상담",
  "floating.kakao.notice": "카카오톡 채널은 준비 중입니다. 견적 문의를 이용해 주세요.",
  "floating.bot.notice": "챗봇 상담은 준비 중입니다. 견적 문의를 이용해 주세요.",
  "floating.noticeCta": "견적 문의로 이동",

  /* ── SNS 버튼 (sns-buttons.tsx) ── */
  "sns.notice": "SNS 채널은 준비 중입니다",

  /* ── 글래스 일정 카드 (schedule-card.tsx) — 요일 구조(WEEK)는 컴포넌트가 원본 ── */
  "schedule.title": "정기 수거 · 배송 일정",
  "schedule.badge": "주 2회 수거 예시",
  "schedule.week.0": "월",
  "schedule.week.1": "화",
  "schedule.week.2": "수",
  "schedule.week.3": "목",
  "schedule.week.4": "금",
  "schedule.week.5": "토",
  "schedule.week.6": "일",
  "schedule.legend.pickup": "수거",
  "schedule.legend.delivery": "배송",
  "schedule.flow.pickup": "사업장 수거",
  "schedule.flow.wash": "세탁 · 살균",
  "schedule.flow.delivery": "사업장 배송",
  "schedule.footnote": "요일과 주기는 상담으로 정합니다 · 예시 화면",

  /* ── 홈 (app/page.tsx) ── */
  "home.hero.eyebrow": "사업장 세탁 전문",
  "home.hero.title1": "수거부터 배송까지",
  /* D5 로테이팅 키워드 — 첫 항목이 기본형(확정 문구·스크린리더용) */
  "home.hero.rotating.0": "사업장 세탁물을",
  "home.hero.rotating.1": "호텔 시트를",
  "home.hero.rotating.2": "펜션 이불을",
  "home.hero.rotating.3": "사우나 수건을",
  "home.hero.titleEm": "대신 관리해 드립니다",
  "home.hero.sub": "약속한 날짜에 수거하고, 세탁·살균을 거쳐 배송합니다.",
  "home.hero.quoteCta": "견적 문의하기",
  /* D7 마퀴 배지 키워드 */
  "home.marquee.0": "정기 수거",
  "home.marquee.1": "전문 세탁",
  "home.marquee.2": "살균 공정",
  "home.marquee.3": "건조 정리",
  "home.marquee.4": "약속한 날짜 배송",
  "home.marquee.5": "월 단위 정기 계약",
  "home.marquee.6": "사업장 전용",
  "home.services.eyebrow": "서 비 스",
  "home.services.title": "사업장 규모, 품목과 물량에 따라 주기적으로 관리해 드립니다",
  "home.services.lede": "품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다.",
  "home.services.detail": "자세히 보기",
  "home.process.eyebrow": "이 용 절 차",
  "home.process.title": "첫 상담부터 배송까지",
  "home.industries.eyebrow": "이 런 곳 에 적 합 합 니 다",
  "home.industries.title": "확인 후 연락드립니다.",
  "home.industries.cta": "바로 문의하기",
  "home.social.title": "장애인 표준사업장으로 운영합니다",
  /* 전단지에 인쇄된 문장 그대로. 방침을 덧붙이지 않는다 */
  "home.social.lede":
    "지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다.",
  "home.social.badge": "장애인 표준사업장 인증",
  "home.cta.eyebrow": "견 적 · 상 담 문 의",
  "home.cta.title": "확인 후 연락드립니다.",
  "home.cta.quoteCta": "견적 문의하기",

  /* ── 회사소개 (app/about/page.tsx) ── */
  "about.hero.eyebrow": "회 사 소 개",
  "about.hero.title": "(주)지성이엔지 지성크리닝",
  "about.hero.lede": "우수조달업체 (주)지성이엔지에서 운영하는 세탁 사업 부문입니다.",
  "about.overview.eyebrow": "사 업 개 요",
  "about.overview.title": "사업장 세탁물을 관리해 드리겠습니다.",
  "about.overview.p1":
    "사업장에서 반복적으로 발생하는 세탁물을 대량으로 수거해 세탁하고 배송합니다. 세탁물이 제때 돌아오도록 약속한 날짜에 맞춰 정기적으로 수거하고 배송합니다.",
  "about.overview.p2":
    "세탁은 자체 세탁 시설에서 전문 세탁 장비로 처리합니다. 품목과 물량, 수거 주기는 사업장 사정에 맞춰 상담해 정합니다.",
  "about.info.heading": "사 업 자 정 보",
  "about.info.name": "상호",
  "about.info.operator": "운영",
  "about.info.representative": "대표자",
  "about.info.registration": "사업자번호",
  "about.info.address": "소재지",
  "about.info.tel": "대표전화",
  "about.info.fax": "팩스",
  "about.info.handlingLabel": "취급",
  "about.info.handling": "사업장 세탁물 정기 수거 · 세탁 · 배송",
  "about.info.sampleNotice": "대표자 · 사업자번호 · 팩스는 확인 전 임시값입니다.",
  "about.info.parentHq": "모회사 본사",
  "about.info.parentSite": "jiseong.co.kr",
  "about.social.eyebrow": "사 회 적 가 치",
  "about.social.title": "장애인 표준사업장으로 운영합니다",
  "about.social.lede":
    "지성크리닝은 장애인에게 안정적인 일자리를 제공하고 사회적 가치를 실현하기 위해 장애인 표준사업장으로 운영되고 있습니다.",
  "about.social.badgeTitle": "장애인 표준사업장",
  "about.social.badgeSub": "장애인 표준사업장 인증",
  "about.clients.eyebrow": "거 래 대 상",
  "about.clients.title": "사업장 고객과 거래합니다",
  "about.clients.lede": "대량 처리와 정기 수거에 맞춰 설비와 일정을 운영하고 있습니다.",
  "about.clients.alert":
    "수거·배송 가능 권역은 경주 인근을 기준으로 운영합니다. 사업장 지역을 알려주시면 가능 여부를 확인해 드립니다.",
  "about.cta.title": "거래를 검토 중이시면 연락 주세요",
  "about.cta.lede": "품목과 물량, 희망 주기를 알려주시면 조건을 정리해 드립니다.",
  "about.cta.quoteCta": "견적 문의하기",
  /* 파트너 문구 — 페이지 끝에 1회만 쓴다 */
  "about.partner.quote": "‘안전한 시공 및 점검으로 신뢰받는 기업’",
  "about.partner.line": "(주)지성이엔지의 파트너 지성크리닝입니다.",

  /* ── 서비스 (app/services/page.tsx) ── */
  "services.hero.eyebrow": "서 비 스",
  "services.hero.title": "사업장 규모, 품목과 물량에 따라 주기적으로 관리해 드립니다",
  "services.hero.lede": "품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다.",
  "services.core.eyebrow": "하나의 서비스, 사업장마다 다른 리듬",
  "services.ops.eyebrow": "운 영 방 식",
  "services.ops.title": "이렇게 운영합니다",
  "services.rhythm.eyebrow": "주 간 리 듬",
  "services.rhythm.title": "사업장의 한 주에 세탁의 박자를 맞춥니다",
  "services.byIndustry.eyebrow": "업 종 별",
  "services.byIndustry.title": "이런 사업장과 함께합니다",
  "services.cta.title": "확인 후 연락드립니다.",
  "services.cta.quoteCta": "견적 문의하기",

  /* ── 견적 (app/quote/page.tsx) ── */
  "quote.hero.eyebrow": "견 적 · 상 담 문 의",
  "quote.hero.title": "확인 후 연락드립니다.",
  "quote.telCard.heading": "전 화 문 의",
  /* 운영시간은 실값 확정 전 — 임시값 노출 대신 폼 안내로 단순화 */
  "quote.telCard.note": "통화가 어려운 시간에는 아래 폼으로 남겨주시면 회신드립니다.",
  "quote.bizCard.heading": "사 업 장 정 보",
  "quote.bizCard.name": "상호",
  "quote.bizCard.operator": "운영",
  "quote.bizCard.address": "주소",
  "quote.stepsCard.heading": "접 수 후 진 행",
  "quote.mapCard.heading": "찾 아 오 는 길",
  "quote.mapCard.naver": "네이버 지도",
  "quote.mapCard.kakao": "카카오맵",
  "quote.mapCard.notice": "지도 임베드는 도메인 확정 후 API 키를 발급받아 이 자리에 넣습니다.",
  "quote.reviews.eyebrow": "이 용 후 기",
  "quote.reviews.title": "먼저 이용하신 사업장의 후기입니다",

  /* ── 견적 폼 (quote-form.tsx) — 서버 검증 오류 문구는 schema.ts 소관 ── */
  "quoteForm.errorSummary": "입력하지 않은 항목이 있습니다. 표시된 칸을 확인해 주세요.",
  "quoteForm.company.label": "업체명",
  "quoteForm.company.placeholder": "예) 보문관광호텔",
  "quoteForm.contactName.label": "성함",
  "quoteForm.contactName.placeholder": "예) 김지성",
  "quoteForm.phone.label": "연락처",
  "quoteForm.phone.placeholder": "010-0000-0000",
  "quoteForm.email.label": "이메일",
  "quoteForm.email.hint": "견적서를 메일로 받으실 경우 적어주세요.",
  "quoteForm.email.placeholder": "manager@example.com",
  "quoteForm.region.label": "주소",
  "quoteForm.region.hint": "수거·배송 가능 여부를 지역 기준으로 확인합니다.",
  "quoteForm.region.placeholder": "예) 경주시 보문로",
  "quoteForm.message.label": "문의 내용",
  "quoteForm.message.placeholder":
    "현재 이용 중인 방식이나 불편한 점을 적어주시면 상담에 도움이 됩니다.",
  "quoteForm.consent.title": "개인정보 수집 · 이용에 동의합니다.",
  /*   는 원문 JSX 의 &nbsp; — 지우면 화면 간격이 달라진다 */
  "quoteForm.consent.detail":
    "수집 항목 : 업체명 · 성함 · 연락처 · 주소 · 이메일  /  목적 : 견적 상담 및 회신  /  보유 기간 : 상담 종료 후 1년",
  "quoteForm.submit": "견적 문의 보내기",
  "quoteForm.pending": "접수 중…",
  "quoteForm.success.title": "접수되었습니다",
  "quoteForm.success.body": "담당자가 확인 후 연락드리겠습니다.",
  "quoteForm.success.idPre": "접수번호는",
  "quoteForm.success.idPost": "입니다.",
  "quoteForm.success.callNote": "급하시면 전화가 가장 빠릅니다.",
};

/* ═══════════════ 참조 — site·sample·services 값을 키에 매핑 ═══════════════ */

const derived: Record<string, string> = {};

/* 브랜드 락업·저작권 (brand-mark.tsx · site-footer.tsx) */
derived["brand.name"] = site.name;
derived["brand.parent"] = site.parent;
derived["footer.operator.parent"] = site.parent;
derived["footer.copyright"] = `${site.name} · ${site.parent}`;

/* 내비게이션 라벨 — 헤더 데스크톱·모바일 메뉴 공용 */
nav.forEach((item, i) => {
  derived[`nav.${i}.label`] = item.label;
});

/* 히어로 신뢰 배지 */
trustPoints.forEach((point, i) => {
  derived[`home.hero.trust.${i}`] = point;
});

/* 적합 업종 라벨 + 서비스 페이지 한 줄 소개(더미가 꺼지면 키도 빠진다) */
targetIndustries.forEach((t, i) => {
  derived[`industries.${i}.label`] = t.label;
  const note = industryNotes?.[t.label];
  if (note) derived[`industries.${i}.note`] = note;
});

/* 통합 서비스 — 홈 카드·서비스 페이지·푸터 링크가 같은 키를 읽는다 */
services.forEach((s) => {
  derived[`service.${s.slug}.short`] = s.short;
  derived[`service.${s.slug}.title`] = s.title;
  derived[`service.${s.slug}.summary`] = s.summary;
  derived[`service.${s.slug}.priceNote`] = s.priceNote;
  s.forWhom.forEach((w, i) => {
    derived[`service.${s.slug}.forWhom.${i}`] = w;
  });
  s.points.forEach((p, i) => {
    derived[`service.${s.slug}.points.${i}.title`] = p.title;
    derived[`service.${s.slug}.points.${i}.body`] = p.body;
  });
});

/* 이용 절차 — 홈 · 견적(접수 후 진행) 공용 */
processSteps.forEach((step, i) => {
  derived[`process.${i}.title`] = step.title;
  derived[`process.${i}.body`] = step.body;
});

/* 후기 더미 — 꺼지면(null) 섹션째 빠지므로 키도 만들지 않는다 */
reviews?.forEach((r, i) => {
  derived[`reviews.${i}.name`] = r.name;
  derived[`reviews.${i}.biz`] = r.biz;
  derived[`reviews.${i}.quote`] = r.quote;
});

/* 자동 슬라이드 — id 가 키라 샘플 모드에 따라 장수가 변해도 안전하다 */
slides.forEach((s) => {
  if (s.eyebrow) derived[`slides.${s.id}.eyebrow`] = s.eyebrow;
  derived[`slides.${s.id}.title`] = s.title;
  if (s.body) derived[`slides.${s.id}.body`] = s.body;
});

/** 키 → 문구 전체 맵. 편집 모드가 "원문" 기준으로 삼는 값이기도 하다 */
export const copy: Record<string, string> = { ...literals, ...derived };
