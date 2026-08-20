# Native component channel and footer update

The homepage now loads the `aktiv-section` replacement record from `content/component-replacements.json` through `src/lib/native-content.ts`, independently of the WordPress bridge. The record controls `text`, `imageUrl`, `imageFit`, and `imagePosition`, and is injected into the Framer runtime bridge by `HomeView`.

A native API channel is available at `GET /api/component-replacements` and `PUT /api/component-replacements`. GET returned HTTP 200 with the active record. PUT without the configured `x-native-admin-token` returned HTTP 401. The write token is configured through `NATIVE_ADMIN_TOKEN` in `.env.example`; no unauthenticated write path was created.

The footer’s Explore control now uses a compass-style icon instead of the previous three-dot icon, and the footer note is `RADAR is AKT!V. ©2026`. The public browser extracted the updated footer note and the new SVG compass icon.

ESLint and production build passed. The homepage and API returned HTTP 200 after restarting the production preview. The live source and current native record continue to use `AKT!V` and `/framer-site/_deps/images/radar-aktiv-preloaded.webp` with contain fit and centered positioning.

The user has not supplied the new background image or replacement copy for the component, so those values remain the current AKT!V defaults rather than being invented. The new editable channel is ready for the user’s desired values. A full authenticated native admin UI and database-backed multi-user persistence remain future work; the current JSON-backed channel is intentionally a single-instance foundation.

Preview: https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?review=native-component-footer

---

