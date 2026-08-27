# 지성크리닝 디자인 시스템 — 사용 규약

## 셋업
- 프로바이더/래퍼 불필요 — 컴포넌트는 단독 렌더된다. 토큰·폰트(Pretendard Variable)는 `styles.css` 하나로 들어온다.
- `SiteHeader`·`SiteFooter`·`FloatingContact`·`MobileCtaBar` 는 페이지 셸 — 화면당 1회, 최상위에 배치.
- `QuoteForm` 은 이 번들에 없다(서버 결합) — 폼이 필요하면 `Card` + 기본 input 마크업으로 레이아웃만 잡을 것.

## 스타일링 어휘 (Tailwind v4 유틸리티 + 아래 토큰만 사용)
색 (`bg-*`/`text-*`/`border-*` 로 사용): `brand` `brand-hover` `navy` `navy-deep` `navy-ink` `tint` `paper` `sky` `pale` `ci-cyan` `ci-deep` `ink` `ink-2` `muted` `faint` `line` `line-strong` `ok` `ok-bg` `warn` `warn-bg` `danger` `danger-bg`
기타: 라운드는 `rounded-brand`, 그림자는 `shadow-card`(카드)·`shadow-raised`(부상), 트랜지션은 `ease-brand`, 컨테이너 폭은 `Container` 컴포넌트가 처리.
- 번들 CSS 에는 **이 앱이 실제 쓴 유틸리티만** 포함된다 — 위 토큰 조합과 흔한 spacing/flex/grid 유틸은 있지만, 임의 값(`w-[123px]`)이나 안 쓰인 클래스는 없을 수 있다. 확신 없는 스타일은 inline style 로.
- 새 색을 발명하지 말 것 — 네이비 배경 위에는 `tone="dark"`/`onNavy` 변형이 이미 있다.

## 진실의 원천
- 토큰·유틸 실체: `styles.css` 와 그 `@import` (`tokens`·`_ds_bundle.css`)
- 컴포넌트 API: 각 `components/general/<Name>/<Name>.d.ts` / 사용법·예시: `<Name>.prompt.md`

## 관용 조립 예시 (검증된 프리뷰에서 발췌)
```tsx
<Section tone="tint">
  <Container>
    <SectionHead
      eyebrow="서 비 스"
      title="사업장 규모, 품목과 물량에 따라 주기적으로 관리해 드립니다"
      lede="품목과 물량, 수거 주기만 알려주시면 사업장에 맞는 방식으로 제안해 드립니다."
    />
    <Card className="mt-8 p-7">
      <IconBubble><Icon.truck className="size-6" /></IconBubble>
      <p className="mt-4 text-ink-2">약속한 날짜에 수거하고, 세탁·살균을 거쳐 배송합니다.</p>
      <ButtonLink href="/quote" size="lg">견적 문의하기</ButtonLink>
    </Card>
  </Container>
</Section>
```

## 콘텐츠 규칙 (이 브랜드의 확정 문구 원칙)
- 용어: 배송(납품·배달 X), 세탁물(린넨 X), 전문 세탁(업소용 X), "약속한 날짜". 부정형("~하지 않습니다")·"24시간" 문구 금지.
- 전화 010-9828-3637 · 업종: 호텔·모텔·펜션·사우나·헬스장·단체시설.
