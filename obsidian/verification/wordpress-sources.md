# WordPress source audit

Date: 2026-08-18

## Primary source

`https://radarcharts.net/wp-json/wp/v2/posts` remains the current self-hosted RADARCharts Articles endpoint used by the existing adapter.

## Secondary source

`https://remradar.wordpress.com/wp-json/` and the site-local `/wp-json/wp/v2/*` paths returned HTML WordPress.com 404 pages instead of REST JSON. The working public WordPress.com REST base is:

`https://public-api.wordpress.com/wp/v2/sites/remradar.wordpress.com/`

The secondary posts endpoint is:

`https://public-api.wordpress.com/wp/v2/sites/remradar.wordpress.com/posts?per_page=5&_embed=1`

The secondary categories endpoint is:

`https://public-api.wordpress.com/wp/v2/sites/remradar.wordpress.com/categories?per_page=100`

The site exposes standard `post` and `page` types through the WordPress.com API, plus a `wp_guideline` type. The category response includes publication categories such as `Discovery Spot` and `MOTHERLand`, confirming that category normalization should preserve the source category and source site.

## Integration decision

The Next.js server adapter will fetch both sources independently with timeouts, normalize them into one `RadarArticle` contract, attach a `source` and `sourceLabel`, deduplicate by canonical URL, sort by date, and continue rendering available content when either source fails. The second site will use the WordPress.com public API base rather than the site-local `wp-json` path.

## Live plugin verification

Browser verification on 2026-08-18 confirmed that `https://radarcharts.net/wp-json/radarcharts/v1/homepage` returns JSON with the default Homepage Components payload, proving the plugin route is active. The live `.../pages` endpoint returns `[]`, meaning the plugin is installed but no RADAR Page records have been published yet. The shell request timed out from the sandbox, but browser retrieval succeeded; this is a network-path difference, not evidence that the endpoint is absent.

Browser verification also confirmed that the live `.../navigation` and `.../services` endpoints are registered and return JSON arrays, but both are currently empty. The plugin is active; the remaining step is to publish RADAR Navigation and RadarStore Service records in WordPress before those datasets replace the Next.js static navigation/catalog fallbacks.
