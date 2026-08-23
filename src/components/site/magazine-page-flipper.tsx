"use client";

import { useState } from "react";
import Link from "next/link";
import type { RadarArticle } from "@/lib/wordpress";

export function MagazinePageFlipper({ articles }: { articles: RadarArticle[] }) {
  const [page, setPage] = useState(0);
  const current = articles[page];
  const total = articles.length;

  if (!current) {
    return <div className="radar-page-empty" role="status"><span className="radar-page-empty__label">MAGAZINE SIGNAL</span><p>Magazine pages are ready for the WordPress feed.</p></div>;
  }

  return (
    <section className="radar-magazine-flipper" aria-label="RADAR Magazine reader">
      <div className="radar-magazine-flipper__toolbar">
        <span>Page {page + 1} / {total}</span>
        <div className="radar-magazine-flipper__controls">
          <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} aria-label="Previous magazine page">←</button>
          <button type="button" onClick={() => setPage((value) => Math.min(total - 1, value + 1))} disabled={page === total - 1} aria-label="Next magazine page">→</button>
        </div>
      </div>
      <div className="radar-magazine-flipper__book" key={current.id}>
        <div className="radar-magazine-flipper__page">
          <p className="radar-route-eyebrow">{current.category} · {current.sourceLabel}</p>
          <h2>{current.title}</h2>
          <p>{current.excerpt}</p>
          <Link href={`/ontheradar/${current.slug}`}>Read the full story ↗</Link>
        </div>
        <div className="radar-magazine-flipper__page radar-magazine-flipper__page--back" aria-hidden="true">
          <span>RADAR</span><strong>MAGAZINE</strong><small>Culture, stories, and signals in motion.</small>
        </div>
      </div>
      <div className="radar-magazine-flipper__progress" aria-hidden="true"><span style={{ width: `${((page + 1) / total) * 100}%` }} /></div>
    </section>
  );
}
