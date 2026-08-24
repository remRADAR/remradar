import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

const PUBLIC_ROUTES = [
  "/",
  "/charts",
  "/ontheradar",
  "/magazine",
  "/radarmusic",
  "/store",
  "/spotlights",
  "/motherland",
  "/platforms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route, index) => ({
    url: `${siteConfig.url}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: index === 0 ? 1 : 0.8,
  }));
}
