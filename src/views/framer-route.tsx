import { notFound } from "next/navigation";
import { FramerRoutePage } from "@/components/site/framer-route-page";
import { RadarStorePage } from "@/components/site/radar-store-page";
import { MagazinePageFlipper } from "@/components/site/magazine-page-flipper";
import { MotherlandPage } from "@/components/site/motherland-page";
import { FRAMER_PAGE_DEFINITIONS, PAGE_ALIASES } from "@/lib/framer-pages";
import { getLatestRadarArticles, getManagedRadarPages, getManagedRadarServices } from "@/lib/wordpress";

export async function FramerRouteView({ route }: { route: string }) {
  const key = PAGE_ALIASES[route] ?? route;
  const definition = FRAMER_PAGE_DEFINITIONS[key];
  if (!definition) notFound();

  const managedPages = await getManagedRadarPages();
  const managedPage = managedPages.find((page) => page.routeKey === key || page.slug === key);

  if (key === "store") {
    const services = await getManagedRadarServices();
    return <RadarStorePage services={services} />;
  }

  if (key === "motherland") {
    return <MotherlandPage />;
  }

  const articles = key === "ontheradar" || key === "magazine" ? await getLatestRadarArticles(12) : [];
  const resolvedDefinition = managedPage
    ? { ...definition, eyebrow: managedPage.eyebrow || definition.eyebrow, title: managedPage.title || definition.title, intro: managedPage.intro || definition.intro }
    : definition;
  return <FramerRoutePage definition={resolvedDefinition} articles={articles} archive={managedPage?.archive} />;
}
