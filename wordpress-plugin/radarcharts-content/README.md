# RADARCharts Content Bridge

This plugin adds the WordPress editing surfaces consumed by the RADARCharts Next.js frontend. It keeps editing in the normal WordPress dashboard and exposes only published content through read-only REST endpoints.

## Installation

1. Zip the `radarcharts-content` folder.
2. In WordPress, open **Plugins → Add New → Upload Plugin**.
3. Upload the zip, install it, and activate **RADARCharts Content Bridge**.
4. Create and publish RADAR Pages, RADAR Navigation items, and RadarStore Services.
5. In the Next.js deployment environment, set `WORDPRESS_BASE_URL=https://radarcharts.net`.

The plugin does not receive or store WordPress credentials. Editorial changes remain protected by the existing WordPress authentication and roles.

## Editable content types

### RADAR Pages

Use the `Route key` field to associate a page with a Next.js route such as `charts`, `magazine`, `spotlights`, or `motherland`. Edit the eyebrow, hero title, hero intro, page body, and archive links. Archive links use one entry per line in the form `Label|/path`.

### RADAR Navigation

Create one item per navigation destination. Set the visible label, relative href, icon key, group (`primary` or `secondary`), and numeric order. The current Next.js footer remains the visual shell; these records provide the future editable navigation source.

### RadarStore Services

Use the title for the service name and the editor for its description. Set the category, price in NGN, and featured flag. The Next.js RadarStore uses these records when the endpoint contains published services and falls back to the built-in catalog when it does not.

## Read-only REST endpoints

- `GET /wp-json/radarcharts/v1/pages`
- `GET /wp-json/radarcharts/v1/navigation`
- `GET /wp-json/radarcharts/v1/services`

Only published records are returned. The Next.js app calls these endpoints server-side, so WordPress URLs and future server configuration remain outside the browser bundle.

## Existing Articles

The existing WordPress posts endpoint remains the source for RADARArticles:

`GET /wp-json/wp/v2/posts?_embed=1`

## RADAR CMS admin hub

After activation, authorized WordPress users with the `edit_posts` capability see **RADAR CMS** in the WordPress admin sidebar and a RADAR CMS widget on the WordPress dashboard. The hub links directly to the editors for RADAR Pages, RADAR Navigation, RadarStore Services, and existing Articles.

Access is protected by WordPress authentication and capabilities. Draft records remain private; the public bridge returns only published records. No separate PHP login, shared password, or browser-exposed API credential is created.

## Homepage Components

The RADAR CMS hub includes **Homepage Components**. This editor controls the data layer around the authored Framer homepage: hero eyebrow/title/intro, Top 25 image URL, Articles label, optional Articles category filter, Now Reading label and links, and the welcome-video URL.

The preserved Framer composition remains the visual core. The current Next.js-owned article stack reads the Articles label and category filter immediately; the other fields are exposed through the CMS contract for the remaining Framer bridge bindings.

## Two publication sources

The Next.js site merges the standard Articles feed from `radarcharts.net` with the public WordPress.com API for `remradar.wordpress.com`:

- `https://radarcharts.net/wp-json/wp/v2/posts`
- `https://public-api.wordpress.com/wp/v2/sites/remradar.wordpress.com/posts`

Each normalized article carries its category, canonical URL, source key, and source label. Duplicate canonical URLs are removed, and if either source fails, content from the other source remains available.
