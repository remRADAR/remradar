# SEO implementation research — 2026-08-20

## Official sources

1. Google Search Central, “Influencing your title links in search results”: https://developers.google.com/search/docs/appearance/title-link
   - Every page should specify a title in `<title>`.
   - Titles should be descriptive, concise, distinct, and avoid keyword stuffing or repeated boilerplate.
   - Google can derive title links from title elements, visible headings, `og:title`, page text, anchor text, and WebSite structured data.

2. Google Search Central, “Control your snippets in search results”: https://developers.google.com/search/docs/appearance/snippet
   - Snippets are primarily generated from page content, but Google may use a meta description when it better describes the page.
   - Unique, page-specific descriptions are recommended, especially for critical URLs and articles.
   - Descriptions should summarize the page rather than provide keyword strings.

3. Google Search Central, “Article structured data”: https://developers.google.com/search/docs/appearance/structured-data/article
   - Article, NewsArticle, or BlogPosting structured data can help Google understand headlines, images, dates, and authors.
   - Recommended fields include headline, image, datePublished, dateModified, author name and URL, and publisher.
   - Article schema should only describe visible, truthful page content; structured data should be validated with the Rich Results Test and URL Inspection after deployment.

4. Schema.org, “Article”: https://schema.org/Article
   - Article supports `citation` for references to other creative works, publications, webpages, or scholarly articles.
   - Article also supports `isBasedOn`, `author`, `publisher`, `datePublished`, `dateModified`, `articleSection`, and related CreativeWork properties.

## Implementation decisions

- Use the supplied RADARCharts logo as the canonical site logo and social preview image.
- Add unique route metadata rather than repeating one site description on every route.
- Add Organization and WebSite JSON-LD with the logo and remRADAR references.
- Add ItemList + Article JSON-LD for the editorial radar collection.
- Emit source, Spotify, artist, release, or data references only when explicitly provided by the CMS; do not fabricate citations or copy unsupported song data.
- Keep the user-facing site tagline `#OnTheRADAR` separate from the descriptive SEO summary so the description remains useful to searchers.
