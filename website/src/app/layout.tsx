import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "경주 세탁물 세탁",
    "호텔 세탁물 세탁",
    "모텔 침구 세탁",
    "펜션 세탁 업체",
    "전문 세탁",
    "월 세탁",
    "장애인 표준사업장",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#14306E",
  width: "device-width",
  initialScale: 1,
};

/**
 * 지역 검색을 위한 구조화 데이터.
 * 영업시간은 확정 전이라 넣지 않았다 —
 * 확인되지 않은 값을 스키마에 넣으면 검색 결과에 잘못된 정보가 노출된다.
 */
function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.tel,
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
      "호텔 세탁물 세탁",
      "모텔 침구 세탁",
      "펜션 세탁물 세탁",
      "전문 세탁",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body className="pb-[4.75rem] lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-brand focus:bg-white focus:px-4 focus:py-2.5 focus:font-bold focus:text-navy focus:shadow-raised"
        >
          본문으로 건너뛰기
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileCtaBar />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
