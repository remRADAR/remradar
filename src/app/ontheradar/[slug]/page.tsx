import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RadarArticleDetail } from "@/components/site/radar-article-detail";
import { getLatestRadarArticles, getRadarArticleBySlug } from "@/lib/wordpress";
import { siteConfig } from "@/lib/site";
import { generateMetadata as createMetadata } from "@/utils/seo/generate-page-metadata";

type Params = { slug: string };

export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  const articles = await getLatestRadarArticles(12);
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getRadarArticleBySlug(slug);
  return createMetadata({ title: article?.title ?? "RADARArticle", description: article?.excerpt ?? siteConfig.description, url: `/ontheradar/${slug}`, siteName: siteConfig.name });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getRadarArticleBySlug(slug);
  if (!article) notFound();
  return <RadarArticleDetail article={article} />;
}
