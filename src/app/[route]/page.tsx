import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FramerRouteView } from "@/views/framer-route";
import { FRAMER_PAGE_DEFINITIONS, PAGE_ALIASES, ACTIVE_FRAMER_ROUTES } from "@/lib/framer-pages";
import { siteConfig } from "@/lib/site";
import { generateMetadata as createMetadata } from "@/utils/seo/generate-page-metadata";

type RouteParams = { route: string };

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return [...ACTIVE_FRAMER_ROUTES, ...Object.keys(PAGE_ALIASES)].map((route) => ({ route }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { route } = await params;
  const key = PAGE_ALIASES[route] ?? route;
  const definition = FRAMER_PAGE_DEFINITIONS[key];
  if (!definition) {
    return {
      title: "Page not found",
      description: "The requested RADARCharts page could not be found.",
      robots: { index: false, follow: false },
    };
  }

  return createMetadata({
    title: definition?.title ?? "RADARCharts archive",
    description: definition?.intro ?? siteConfig.description,
    url: `/${route}`,
    siteName: siteConfig.name,
  });
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { route } = await params;
  const key = PAGE_ALIASES[route] ?? route;
  if (!FRAMER_PAGE_DEFINITIONS[key]) notFound();
  return <FramerRouteView route={route} />;
}
