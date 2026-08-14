# RADARCharts by REM — Site Source of Truth

## Purpose

This document records the verified boundaries for the Framer migration so future engineering work does not confuse the original Framer export, the new frontend, or WordPress CMS responsibilities.

## Sources

- Live visual/product reference: https://radarcharts.framer.website/
- Repository: `remRADAR/https-github.com-remRADAR-radarcharts-framer-migration`
- Immutable Framer reference export: `dist-original/`

## Verified route map

- `/`
- `/charts`
- `/ontheradar`
- `/magazine`
- `/radarmusic`
- `/spotlights`
- `/motherland`
- `/platforms`
- `/playlists`
- `/store`
- `/about`
- `/404`

The route list is an implementation reference, not a statement that every route is already migrated into the new frontend.

## Architecture boundary

### Framer

Framer is the current visual/product reference.

Its generated HTML, CSS, JavaScript and assets remain useful as migration evidence.

`dist-original/` should not be treated as the long-term application architecture.

### New RADAR frontend

The new frontend owns:

- information architecture;
- page layouts and templates;
- typography and visual system;
- responsive behavior;
- interactions and UI states;
- article, chart, artist, magazine and discovery presentation.

The frontend must not inherit WordPress theme/template constraints merely because WordPress supplies content.

### WordPress

The existing WordPress installations are CMS sources only for the agreed content boundary, principally:

- articles/editorial content;
- approved brand/media assets.

WordPress is not the design system or template engine for the new Framer-derived frontend.

### RADARStore

RADARStore payment functionality remains isolated behind its API/function boundary.

Server-side service pricing is authoritative.

Payment implementation should not be coupled to editorial CMS work.

### Hosting

Cloudflare/hosting work is deliberately deferred until the frontend, CMS integration and QA are complete.

## Known migration residue

The original Framer homepage contains template-generated metadata that is inconsistent with RADARCharts.

In particular, the description/social metadata still references the StoryStream video-production template.

This is migration residue and must not be carried into the production RADAR frontend.

## Engineering rule

Treat `dist-original/` as reference evidence.

Build the controlled RADAR frontend separately, preserving the ability to compare against the original export while replacing template residue and establishing the final RADAR design/content architecture.