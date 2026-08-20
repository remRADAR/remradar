# RADARStore and active platform integration

Date: 2026-08-18

## Source audit

The referenced GitHub repository contains `custom/radarstore/index.html`, `custom/radarstore/store.css`, and `custom/radarstore/store.js`, plus `custom/site-shell.js` and `custom/radar-visual-layer.js`.

The RADARStore source defines a hero, service grid, package builder, audience cards, and rate-card link. Its service catalog contains Page Post (₦50,000), Artist Spotlight (₦100,000), Release Campaign (₦250,000), and Premium Campaign (₦500,000). The browser-side payment handoff targets `/api/create-payment`, but no corresponding payment route exists in the active Next.js app; checkout is therefore intentionally disabled until a server-authoritative payment provider integration is approved and configured. The WhatsApp consultation link and rate-card link are preserved.

`custom/site-shell.js` is important as a source of intended navigation grouping: primary routes are Charts, On The Radar, Magazine, RADAR Music, Spotlights, Motherland, Platforms, and Playlists; secondary routes are Store and About. Its DOM-injection shell was not copied directly because the Next.js app already owns the route shell and footer.

`custom/radar-visual-layer.js` is separate from store logic. It is important for the welcome-video/cinematic overlay milestone and explicitly does not rebuild the Framer page or modify store/payment logic.

## Implemented

- Added typed service data at `src/lib/radar-store.ts`.
- Added interactive native RadarStore at `src/components/site/radar-store-page.tsx`.
- Routed `/store` through `src/views/framer-route.tsx`.
- Migrated the store hero, service cards, selection state, package total, audience section, and rate-card CTA into the RADAR design-token system.
- Added a shared Page archive strip to every active native platform hero.
- Kept WordPress article data on `/ontheradar` through the existing normalized adapter and `/api/articles` path.

## Verification

`yarn lint` passed. `yarn build` passed. The live local routes `/store`, `/charts`, `/ontheradar`, `/platforms`, `/playlists`, `/spotlights`, `/motherland`, `/radarmusic`, and `/about` returned HTTP 200 and rendered their expected route markers.
