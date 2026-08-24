# WordPress CMS to Vercel migration guide

## Development hostname

Use the stable Git-main Vercel alias while `radarcharts.net` remains hosted on WordPress:

`https://remradar-git-main-remradars-projects.vercel.app`

Do not change the DNS records for `radarcharts.net` during development. The Vercel alias is safe for staging and can be replaced later with the production domain after the site and CMS integration are approved.

## Recommended architecture

Keep WordPress as the content-management system and use Next.js on Vercel as the presentation layer. Editors continue publishing in WordPress; Vercel server-rendered routes read published content through the WordPress REST API and cache responses for five minutes. This avoids duplicating editorial data and prevents the Vercel migration from depending on WordPress admin internals.

The current adapter supports two sources:

| Source | Endpoint | Role |
|---|---|---|
| RADARCharts | `https://radarcharts.net/wp-json/wp/v2` | Current RADARCharts articles and categories |
| REM RADAR archive | `https://public-api.wordpress.com/wp/v2/sites/remradar.wordpress.com` | Older publication archive |

The Next.js adapter normalizes both sources into one article model, merges them by publication date, removes duplicate URLs, and returns empty results when an upstream request fails. The five-minute cache and three-and-a-half-second request timeout are deliberate crash-prevention measures: a slow or unavailable WordPress server should not take down the Vercel page.

## Vercel environment variables

Configure these in the Vercel project settings for **Preview** and **Production** rather than committing secrets to Git:

| Variable | Preview value now | Production value after cutover |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://remradar-git-main-remradars-projects.vercel.app` | `https://radarcharts.net` |
| `WORDPRESS_BASE_URL` | `https://radarcharts.net` | Keep the WordPress origin until CMS migration is complete |
| `WORDPRESS_COM_SITE` | `remradar.wordpress.com` | Keep unchanged unless the archive is moved |
| `NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID` | `PLZ_5O41VO5Mk` | Keep unchanged |
| `NATIVE_ADMIN_TOKEN` | A long random server-only token | Rotate before production cutover |
| `CONTACT_ENDPOINT` | Optional CRM/webhook URL | Optional CRM/webhook URL |

`NEXT_PUBLIC_SITE_URL` controls canonical URLs, sitemap output, robots output, Open Graph metadata, and JSON-LD. It should be changed only when the final domain is ready. `NATIVE_ADMIN_TOKEN`, if used, must never receive the `NEXT_PUBLIC_` prefix and must never be exposed in browser code.

## Safe testing sequence

First, publish a draft or test article in WordPress and confirm it appears through the Vercel article listing and its slug route. Next, verify featured images, categories, dates, article references, and the older WordPress.com archive. Then test a WordPress outage by temporarily using an invalid preview origin; the homepage must still render, the article API must return a safe empty result, and the page must not enter a crash loop. Restore the correct origin after the test.

Before production cutover, test the following on the Vercel alias: homepage loading after a cold request, welcome GIF delivery, Liberty PNG delivery, every public route, a missing route returning 404, sitemap and robots output, article detail routes, cache revalidation, mobile layout, and the persistent player across route changes.

## Domain cutover procedure

Keep the WordPress DNS and WordPress hosting unchanged until the Vercel version is accepted. In Vercel, add `radarcharts.net` and any required `www` hostname to the existing project, but do not switch the registrar DNS yet. Verify ownership and wait until Vercel reports the domain configuration as valid.

Lower the DNS TTL before the planned migration window. During the cutover, point the apex and `www` records to the exact Vercel records displayed in the project domain settings. Do not guess the record values. Leave WordPress available for rollback and keep its content unchanged.

After DNS propagation, set `NEXT_PUBLIC_SITE_URL=https://radarcharts.net` in Vercel Production, redeploy, and verify canonical tags, sitemap URLs, robots output, article links, media, forms, and the browser console. Revalidate the important pages from an external network and from a mobile device.

## Rollback

If the Vercel deployment fails, first roll back to the last ready Vercel deployment. If the domain or CMS behavior is still incorrect, restore the previous DNS records to WordPress. Because WordPress remains online and its content is not deleted during this process, the rollback does not require a database restore. Only remove the WordPress origin after the new CMS platform has been independently backed up and accepted.

## Important limitation

The currently linked Vercel project has a Git production deployment permission/configuration issue: some automatic production deployments are marked `BLOCKED`, while the Git-main preview alias is ready. The repository is already pushed and builds cleanly. Before final DNS cutover, reauthorize the Vercel GitHub connection for the private `remRADAR/remradar` repository or have the team owner resolve the project collaboration setting so automatic production deployments consistently reach `READY`.
