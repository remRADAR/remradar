"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import type { RadarArticle } from "@/lib/wordpress";

const FALLBACK_ARTICLES: RadarArticle[] = [
  {
    id: "fallback-1",
    slug: "radar-article-preview-1",
    title: "The next sound is already moving",
    category: "ON THE RADAR",
    excerpt: "A live editorial slot for the next story from the RADARCharts newsroom.",
    image: "",
    url: "/ontheradar",
    date: "",
    source: "radarcharts",
    sourceLabel: "RADARCharts",
  },
  {
    id: "fallback-2",
    slug: "radar-article-preview-2",
    title: "Artists building culture in motion",
    category: "SPOTLIGHTS",
    excerpt: "Discover the people and ideas shaping independent music right now.",
    image: "",
    url: "/spotlights",
    date: "",
    source: "radarcharts",
    sourceLabel: "RADARCharts",
  },
  {
    id: "fallback-3",
    slug: "radar-article-preview-3",
    title: "The signal behind the noise",
    category: "RADAR MUSIC",
    excerpt: "Editorial intelligence for listeners who want to know what moves next.",
    image: "",
    url: "/radarmusic",
    date: "",
    source: "radarcharts",
    sourceLabel: "RADARCharts",
  },
  {
    id: "fallback-4",
    slug: "radar-article-preview-4",
    title: "Read deeper. Hear further.",
    category: "CURATED",
    excerpt: "A CMS-fed card slot ready for the next RADARCharts feature.",
    image: "",
    url: "/ontheradar",
    date: "",
    source: "radarcharts",
    sourceLabel: "RADARCharts",
  },
];

function CardStack({ articles, label, categoryFilter }: { articles: RadarArticle[]; label: string; categoryFilter: string }) {
  const [expanded, setExpanded] = useState(false);
  const cards = useMemo(() => {
    const filtered = categoryFilter
      ? articles.filter((article) => article.category.toLowerCase().includes(categoryFilter.toLowerCase()))
      : articles;
    return (filtered.length >= 4 ? filtered.slice(0, 4) : [...filtered, ...FALLBACK_ARTICLES].slice(0, 4));
  }, [articles, categoryFilter]);

  return (
    <section className={`radar-article-stack ${expanded ? "is-expanded" : ""}`} aria-label={label}>
      <div className="radar-article-stack__header">
        <p className="radar-article-stack__eyebrow">{label}</p>
        <button
          type="button"
          className="radar-article-stack__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Collapse" : "Expand articles"}
        </button>
      </div>
      <div className="radar-article-stack__cards" onMouseLeave={() => setExpanded(false)}>
        {cards.map((article, index) => (
          <a
            className="radar-article-card"
            href={article.url}
            key={article.id}
            onMouseEnter={() => setExpanded(true)}
            style={{ "--stack-index": index } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className="radar-article-card__image"
              style={article.image ? { backgroundImage: `url(${article.image})` } : undefined}
            />
            <span className="radar-article-card__shade" aria-hidden="true" />
            <span className="radar-article-card__content">
              <span className="radar-article-card__category">{article.category}</span>
              <span className="radar-article-card__title">{article.title}</span>
              <span className="radar-article-card__excerpt">{article.excerpt}</span>
              <span className="radar-article-card__link">Read article ↗</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function RadarArticleCardStack({ articles, label = "RADARARTICLES", categoryFilter = "" }: { articles: RadarArticle[]; label?: string; categoryFilter?: string }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findTarget = () => {
      const frame = document.querySelector<HTMLIFrameElement>("iframe[data-radar-framer]");
      const nextTarget = frame?.contentDocument?.getElementById("radar-article-stack-slot") ?? null;
      setTarget(nextTarget);
      return Boolean(nextTarget);
    };

    if (findTarget()) return;
    const frame = document.querySelector<HTMLIFrameElement>("iframe[data-radar-framer]");
    frame?.addEventListener("load", findTarget);
    const timer = window.setInterval(findTarget, 250);

    return () => {
      frame?.removeEventListener("load", findTarget);
      window.clearInterval(timer);
    };
  }, []);

  return target ? createPortal(<CardStack articles={articles} label={label} categoryFilter={categoryFilter} />, target) : null;
}
