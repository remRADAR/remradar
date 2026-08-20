import { siteConfig } from "@/lib/site";
import type { RadarArticle } from "@/lib/wordpress";

/**
 * Organization + WebSite schema for the site root. Emit once in the root
 * layout so crawlers can connect the publication, brand, and canonical site.
 */
export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}${siteConfig.logo}`,
        sameAs: siteConfig.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        abstract: siteConfig.tagline,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };
}

function absoluteUrl(value: string) {
  try {
    return new URL(value, siteConfig.url).toString();
  } catch {
    return null;
  }
}

/**
 * Collection markup for the editorial radar. Citation URLs are emitted only
 * when they are supplied by the CMS, allowing Spotify and other references to
 * support an article without inventing or copying unsupported claims.
 */
export function getArticleCollectionStructuredData(articles: RadarArticle[]) {
  const items = articles.map((article, index) => {
    const articleUrl = absoluteUrl(article.url) ?? `${siteConfig.url}/ontheradar/${article.slug}`;
    const imageUrl = article.image ? absoluteUrl(article.image) : null;
    const references = article.references
      ?.map((reference) => absoluteUrl(reference.url))
      .filter((reference): reference is string => Boolean(reference));

    return {
      "@type": "ListItem",
      position: index + 1,
      url: articleUrl,
      item: {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        articleSection: article.category,
        datePublished: article.date || undefined,
        image: imageUrl ? [imageUrl] : undefined,
        mainEntityOfPage: articleUrl,
        author: {
          "@type": "Organization",
          name: article.sourceLabel,
          url: article.source === "remradar" ? "https://remradar.wordpress.com" : "https://radarcharts.net",
        },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        isBasedOn: references?.[0],
        citation: references?.slice(1),
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/ontheradar#article-list`,
    name: "RADARArticles",
    description: "Editorial stories and cultural signals from RADARCharts by REM.",
    numberOfItems: items.length,
    itemListElement: items,
  };
}
