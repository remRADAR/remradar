/**
 * @fileoverview Standardised metadata + viewport generators for pages.
 *
 * `generateMetadata` builds a Next.js `Metadata` object — basic meta tags,
 * OpenGraph, Twitter cards, canonical URL, icons, robots. `metadataBase` is
 * always set (from `siteConfig`) so relative URLs (OG image, canonical)
 * resolve to absolute — required by social scrapers.
 *
 * `generateViewport` builds the `Viewport` export. `themeColor` lives here, not
 * in `Metadata` — Next deprecated it on the metadata object.
 */

import { Metadata, Viewport } from "next";

import { siteConfig } from "@/lib/site";

interface MetadataProps {
  title?: string;
  description?: string;
  /** Canonical path (e.g. `/about`) or absolute URL for this page. */
  url?: string;
  /** Open Graph / Twitter image — path under `public/` or absolute URL. */
  ogImage?: string;
  twitterHandle?: string;
  author?: string;
  siteName?: string;
  keywords?: readonly string[];
}

export function generateMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  url = "/",
  ogImage = siteConfig.ogImage,
  twitterHandle = siteConfig.twitterHandle,
  author = siteConfig.author,
  siteName = siteConfig.name,
  keywords = siteConfig.keywords,
}: MetadataProps = {}): Metadata {
  return {
    // Resolves every relative URL below to an absolute one.
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s | ${siteConfig.name}` },
    description,
    keywords: [...keywords],
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    category: "music and culture",
    formatDetection: { telephone: false },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      // Dimensions must match the real asset; 1200×630 is the ideal size.
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.tagline}` }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: twitterHandle,
      creator: twitterHandle,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/radarmatrix-favicon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: siteConfig.themeColor,
    width: "device-width",
    initialScale: 1,
  };
}
