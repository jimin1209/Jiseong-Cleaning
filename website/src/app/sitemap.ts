import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/quote", priority: 0.9 },
  ];

  return staticRoutes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
