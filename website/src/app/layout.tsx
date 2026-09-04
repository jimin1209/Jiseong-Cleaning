import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CopyEditRoot } from "@/components/copy-edit-root";
import { T } from "@/components/copy-text";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { FloatingContact } from "@/components/floating-contact";
import { readLiveCopySafe } from "@/lib/copy-live";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · 사업장 세탁물 수거·세탁·배송`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "경주 사업장 세탁",
    "호텔 세탁",
    "모텔 침구 세탁",
    "펜션 세탁 업체",
    "사우나 세탁",
    "헬스장 수건 세탁",
    "전문 세탁",
    "월세탁",
    "장애인 표준사업장",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} · 사업장 세탁물 수거·세탁·배송`,
    description: site.description,
    url: site.url,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

/**
 * 편집자가 「사이트에 반영」을 누르면 다음 접속부터 바로 새 문구가 보여야 한다.
 * 정적 생성(빌드 시점 고정)으로 두면 배포를 다시 하기 전까지 반영이 안 되므로
 * 레이아웃을 요청 시 렌더로 돌린다 — 게시본 조회 1회가 늘어나는 대신
 * "눌렀는데 안 바뀐다" 가 구조적으로 생기지 않는다.
 */
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#14306E",
  width: "device-width",
  initialScale: 1,
};

/**
 * 지역 검색을 위한 구조화 데이터.
 * 사업자등록번호·영업시간은 확정 전이라 넣지 않았다 —
 * 확인되지 않은 값을 스키마에 넣으면 검색 결과에 잘못된 정보가 노출된다.
 */
function LocalBusinessJsonLd({ tel, telMobile }: { tel: string; telMobile: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    // 두 번호를 모두 노출한다. 대표전화가 첫 값이라 검색 결과의 대표 표기가 된다
    telephone: [tel, telMobile],
    parentOrganization: { "@type": "Organization", name: site.parent },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "경상북도",
      addressLocality: "경주시",
      streetAddress: "강동면 모서안길 44",
    },
    areaServed: { "@type": "AdministrativeArea", name: "경상북도 경주시" },
    knowsAbout: [
      "호텔 세탁",
      "모텔 침구 세탁",
      "펜션 세탁",
      "사우나 세탁",
      "전문 대량 세탁",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // 값은 모두 코드에 있는 상수이므로 외부 입력이 섞이지 않는다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // 저장소가 죽어도 화면은 코드 원문으로 정상 렌더된다(readLiveCopySafe)
  const { overrides } = await readLiveCopySafe();

  return (
    <html lang="ko">
      <body className="pb-[4.75rem] lg:pb-0">
        {/* 편집 모드 뿌리 — /admin/edit 밖에서는 패스스루라 화면 결과가 동일하다.
            헤더·푸터·플로팅까지 편집 대상이라 페이지가 아닌 레이아웃 수준에서 감싼다 */}
        <CopyEditRoot published={overrides}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-brand focus:bg-white focus:px-4 focus:py-2.5 focus:font-bold focus:text-navy focus:shadow-raised"
          >
            <T k="layout.skip" />
          </a>
          {/* 상단 샘플 경고 배너는 떼기로 했다(회의) — 컴포넌트·SAMPLE_CONTENT 스위치는 더미 관리용으로 유지 */}
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MobileCtaBar />
          {/* 어느 페이지에서든 스크롤 위치와 무관하게 문의 경로가 보이게 한다 */}
          <FloatingContact />
        </CopyEditRoot>
        <LocalBusinessJsonLd
          tel={overrides["site.tel"] || site.tel}
          telMobile={overrides["site.telMobile"] || site.telMobile}
        />
      </body>
    </html>
  );
}
