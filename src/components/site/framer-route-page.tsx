import Image from "next/image";
import Link from "next/link";
import { FloatingDockFooter } from "@/components/site/floating-dock-footer";
import type { FramerPageDefinition } from "@/lib/framer-pages";
import type { RadarArticle, RadarPageArchiveLink } from "@/lib/wordpress";
import { MagazinePageFlipper } from "@/components/site/magazine-page-flipper";
import { getArticleCollectionStructuredData } from "@/utils/seo/structured-data";

const navigation = [
  ["Charts", "/charts"],
  ["Platforms", "/platforms"],
  ["Playlists", "/playlists"],
  ["RadarStore", "/store"],
  ["Articles", "/ontheradar"],
  ["Magazine", "/magazine"],
  ["Spotlights", "/spotlights"],
  ["RADARMusic", "/radarmusic"],
  ["Motherland", "/motherland"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

function ArticleList({ articles }: { articles: RadarArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="radar-page-empty" role="status">
        <span className="radar-page-empty__label">CMS SIGNAL</span>
        <p>Articles are ready for the WordPress feed.</p>
      </div>
    );
  }

  return (
    <div className="radar-page-article-grid">
      {articles.map((article) => (
        <Link className="radar-page-article" href={article.url} key={article.id}>
          <span className="radar-page-article__meta">{article.category}</span>
          <span className="radar-page-article__title">{article.title}</span>
          <span className="radar-page-article__excerpt">{article.excerpt}</span>
        </Link>
      ))}
    </div>
  );
}

export function FramerRoutePage({ definition, articles = [], archive = [] }: { definition: FramerPageDefinition; articles?: RadarArticle[]; archive?: RadarPageArchiveLink[] }) {
  const archiveLinks = archive.length ? archive : navigation.slice(0, 8).map(([label, href]) => ({ label, href }));
  const articleStructuredData = articles.length ? getArticleCollectionStructuredData(articles) : null;

  return (
    <main className="radar-route-shell">
      {articleStructuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      ) : null}
      <header className="radar-route-header">
        <Link className="radar-route-header__logo" href="/" aria-label="RADARCharts by REM home">
          <Image src="/radarcharts-logo-transparent.png" alt="RADARCharts by REM" width={180} height={120} priority />
        </Link>
        <Link className="radar-route-header__home" href="/">Home</Link>
      </header>

      <section className="radar-route-hero">
        <p className="radar-route-eyebrow">{definition.eyebrow}</p>
        <h1>{definition.title}</h1>
        <p className="radar-route-intro">{definition.intro}</p>
        <nav className="radar-route-archive" aria-label="RADAR page archive">
          <span>Page archive</span>
          {archiveLinks.map(({ label, href }) => <Link href={href} key={`${label}-${href}`}>{label}</Link>)}
        </nav>
      </section>

      {definition.slug === "magazine" ? (
        <section className="radar-route-section">
          <div className="radar-route-section__heading">
            <p className="radar-route-eyebrow">RADAR MAGAZINE</p>
            <h2>Turn the page. Stay close to culture.</h2>
          </div>
          <MagazinePageFlipper articles={articles} />
        </section>
      ) : definition.slug === "ontheradar" ? (
        <section className="radar-route-section">
          <div className="radar-route-section__heading">
            <p className="radar-route-eyebrow">RADARARTICLES</p>
            <h2>Stories worth staying close to.</h2>
          </div>
          <ArticleList articles={articles} />
        </section>
      ) : (
        <div className="radar-route-sections">
          {definition.sections.map((section) => (
            <section className="radar-route-section" key={section.title || section.eyebrow}>
              {section.eyebrow ? <p className="radar-route-eyebrow">{section.eyebrow}</p> : null}
              {section.title ? <h2>{section.title}</h2> : null}
              {section.body ? <p className="radar-route-body">{section.body}</p> : null}
              {section.items?.length ? (
                <div className="radar-route-tags">
                  {section.items.map((item) => <span className="radar-route-tag" key={item}>{item}</span>)}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}

      <nav className="radar-route-navigation" aria-label="RADAR navigation">
        {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>

      <FloatingDockFooter />
    </main>
  );
}
