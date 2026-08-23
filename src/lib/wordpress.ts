export type RadarArticleSource = "radarcharts" | "remradar";

export type RadarArticleReference = {
  url: string;
  label?: string;
  type?: "source" | "spotify" | "artist" | "release" | "data";
};

export type RadarArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  image: string;
  url: string;
  date: string;
  modified?: string;
  source: RadarArticleSource;
  sourceLabel: string;
  references?: RadarArticleReference[];
};

type WordPressPost = {
  id: number;
  slug: string;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  author?: number;
  modified?: string;
  categories?: number[];
  meta?: {
    source_url?: string;
    spotify_url?: string;
    references?: Array<{ url?: string; label?: string; type?: RadarArticleReference["type"] }>;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string }>;
    "wp:term"?: Array<Array<{ name?: string }>>;
  };
};

const WORDPRESS_BASE_URL = (process.env.WORDPRESS_BASE_URL || "https://radarcharts.net").replace(/\/$/, "");
const WORDPRESS_COM_SITE = process.env.WORDPRESS_COM_SITE || "remradar.wordpress.com";
const WORDPRESS_COM_BASE_URL = `https://public-api.wordpress.com/wp/v2/sites/${encodeURIComponent(WORDPRESS_COM_SITE)}`;

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFor(post: WordPressPost, fallback: string) {
  return (
    post._embedded?.["wp:term"]?.flat().find((term) => term.name)?.name ?? fallback
  ).toUpperCase();
}

export function normalizeWordPressPost(post: WordPressPost, source: RadarArticleSource, sourceLabel: string): RadarArticle {
  const references = [
    ...(post.meta?.references ?? []),
    ...(post.meta?.source_url ? [{ url: post.meta.source_url, label: "Source", type: "source" as const }] : []),
    ...(post.meta?.spotify_url ? [{ url: post.meta.spotify_url, label: "Spotify", type: "spotify" as const }] : []),
  ].filter((reference): reference is RadarArticleReference => Boolean(reference.url));

  return {
    id: `${source}:${post.id}`,
    slug: post.slug,
    title: stripHtml(post.title?.rendered) || "Untitled RADARArticle",
    category: categoryFor(post, sourceLabel),
    excerpt: stripHtml(post.excerpt?.rendered) || "Discover what is moving culture next.",
    content: post.content?.rendered || "",
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
    url: post.link || `/ontheradar/${post.slug}`,
    date: post.date || "",
    modified: post.modified,
    source,
    sourceLabel,
    references: references.length ? references : undefined,
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getPostsFromSource(
  endpoint: string,
  source: RadarArticleSource,
  sourceLabel: string,
  limit: number,
): Promise<RadarArticle[]> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const posts = await fetchJson<WordPressPost[]>(`${endpoint}${separator}per_page=${Math.min(Math.max(limit, 1), 12)}&_embed=1`);
  return posts?.map((post) => normalizeWordPressPost(post, source, sourceLabel)) ?? [];
}

export async function getRadarArticleBySlug(slug: string): Promise<RadarArticle | null> {
  const encodedSlug = encodeURIComponent(slug);
  const [radarcharts, remradar] = await Promise.all([
    getPostsFromSource(`${WORDPRESS_BASE_URL}/wp-json/wp/v2/posts?slug=${encodedSlug}`, "radarcharts", "RADARCharts", 1),
    getPostsFromSource(`${WORDPRESS_COM_BASE_URL}/posts?slug=${encodedSlug}`, "remradar", "REM RADAR Archive", 1),
  ]);
  return [...radarcharts, ...remradar].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;
}

export async function getLatestRadarArticles(limit = 4): Promise<RadarArticle[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 12);
  const [radarcharts, remradar] = await Promise.all([
    getPostsFromSource(`${WORDPRESS_BASE_URL}/wp-json/wp/v2/posts`, "radarcharts", "RADARCharts", safeLimit),
    getPostsFromSource(`${WORDPRESS_COM_BASE_URL}/posts`, "remradar", "REM RADAR Archive", safeLimit),
  ]);

  const merged = [...radarcharts, ...remradar]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((article, index, articles) => articles.findIndex((candidate) => candidate.url === article.url) === index);

  return merged.slice(0, safeLimit);
}

export type RadarPageArchiveLink = { label: string; href: string };

export type RadarManagedPage = {
  id: number;
  slug: string;
  routeKey: string;
  eyebrow: string;
  title: string;
  intro: string;
  archive: RadarPageArchiveLink[];
  content: string;
};

export type RadarNavigationItem = {
  id: number;
  label: string;
  href: string;
  icon: string;
  group: "primary" | "secondary";
  order: number;
};

export type RadarManagedService = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceNgn: number;
  featured: boolean;
};

async function getWordPressBridge<T>(path: string): Promise<T | null> {
  return fetchJson<T>(`${WORDPRESS_BASE_URL}/wp-json/radarcharts/v1/${path}`);
}

export async function getManagedRadarPages(): Promise<RadarManagedPage[]> {
  return (await getWordPressBridge<RadarManagedPage[]>("pages")) ?? [];
}

export async function getManagedRadarNavigation(): Promise<RadarNavigationItem[]> {
  return (await getWordPressBridge<RadarNavigationItem[]>("navigation")) ?? [];
}

export async function getManagedRadarServices(): Promise<RadarManagedService[]> {
  return (await getWordPressBridge<RadarManagedService[]>("services")) ?? [];
}


export type RadarHomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  top25ImageUrl: string;
  articleLabel: string;
  articleCategory: string;
  nowReadingLabel: string;
  nowReadingLinks: RadarPageArchiveLink[];
  welcomeVideoUrl: string;
};

export async function getRadarHomepageContent(): Promise<RadarHomepageContent | null> {
  return getWordPressBridge<RadarHomepageContent>("homepage");
}
