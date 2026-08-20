/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update the placeholder values per project.
 */
import { publicEnv } from "@/env";

export const siteConfig = {
  name: "RADARCharts by REM",
  tagline: "#OnTheRADAR",
  description: "RADARCharts by REM is the remRADAR platform for music discovery, culture, editorial stories, charts, artist intelligence, and creative technology.",
  keywords: ["RADARCharts", "remRADAR", "music discovery", "music charts", "artist intelligence", "music editorial", "African music", "culture", "RADARMusic"],
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "https://radarcharts.net",
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/open-graph.png",
  logo: "/radarcharts-logo.webp",
  sameAs: ["https://radarcharts.net", "https://remradar.wordpress.com"],
  twitterHandle: "@remRADAR",
  author: "remRADAR",
  /** Browser theme-color (address bar / PWA). */
  themeColor: "#000000",
} as const;
