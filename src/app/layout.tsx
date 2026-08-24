import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { LazyCookie } from "@/components/common/Cookie";
import { AdaptiveGrid } from "@/components/common/grid";
import { TimeOfDayBackground } from "@/components/site/time-of-day-background";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollLayout } from "@/layouts/scroll-layout";
import { YouTubePlaylistPlayer } from "@/components/site/youtube-playlist-player";
import { PwaRegister } from "@/components/site/pwa-register";

import "@/app/globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <ScrollLayout>
          <TimeOfDayBackground />
          <AdaptiveGrid />
          <ReducedMotion />
          <LazyCookie />
          {children}
          <YouTubePlaylistPlayer />
          <PwaRegister />
        </ScrollLayout>
      </body>
    </html>
  );
}
