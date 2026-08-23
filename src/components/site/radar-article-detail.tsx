import Image from "next/image";
import Link from "next/link";
import { FloatingDockFooter } from "@/components/site/floating-dock-footer";
import type { RadarArticle } from "@/lib/wordpress";

function safeArticleHtml(value = "") {
  return value.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
}

export function RadarArticleDetail({ article }: { article: RadarArticle }) {
  return (
    <main className="radar-route-shell radar-article-detail">
      <header className="radar-route-header">
        <Link className="radar-route-header__logo" href="/" aria-label="RADARCharts by REM home">
          <Image src="/radarcharts-logo-transparent.png" alt="RADARCharts by REM" width={180} height={120} priority />
        </Link>
        <Link className="radar-route-header__home" href="/ontheradar">All articles</Link>
      </header>
      <article className="radar-article-detail__article">
        <p className="radar-route-eyebrow">{article.category} · {article.sourceLabel}</p>
        <h1>{article.title}</h1>
        <p className="radar-article-detail__date">{article.date ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(article.date)) : "RADAR archive"}</p>
        {article.image ? <Image className="radar-article-detail__image" src={article.image} alt="" width={1600} height={900} unoptimized /> : null}
        <p className="radar-article-detail__excerpt">{article.excerpt}</p>
        <div className="radar-article-detail__content" dangerouslySetInnerHTML={{ __html: safeArticleHtml(article.content || `<p>${article.excerpt}</p>`) }} />
        {article.references?.length ? (
          <aside className="radar-article-detail__references" aria-label="Article references">
            <p className="radar-route-eyebrow">REFERENCES</p>
            {article.references.map((reference) => <a href={reference.url} key={reference.url} target="_blank" rel="noreferrer">{reference.label || reference.type || "Open reference"} ↗</a>)}
          </aside>
        ) : null}
      </article>
      <FloatingDockFooter />
    </main>
  );
}
