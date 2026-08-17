import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 문의 목록에는 거래처 연락처가 들어간다
        disallow: ["/admin"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
