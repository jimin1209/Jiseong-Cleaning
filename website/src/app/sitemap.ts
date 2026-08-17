import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/facility", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/quote", priority: 0.9 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority,
    })),
    // 서비스 상세는 지역·업종 검색어를 받는 페이지라 우선순위를 높게 둔다
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
