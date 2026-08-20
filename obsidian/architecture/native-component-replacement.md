# Native component replacement channel

## Decision

The authored Framer homepage remains the visual source, while editable component overrides are now read from the application’s own `content/component-replacements.json` record. WordPress continues to supply publications, navigation, pages, and services, but it no longer needs to carry the homepage component override.

## Current record

The `aktiv-section` record controls the section text, image URL, fit mode, and focal position. The server-side homepage view reads this record and injects it into the Framer runtime bridge. This keeps the replacement deterministic and prevents the WordPress server from processing every component render.

## Editing channel

`GET /api/component-replacements` returns the current replacement record. `PUT /api/component-replacements` accepts a validated partial payload and requires the `x-native-admin-token` header to match `NATIVE_ADMIN_TOKEN`. The API writes only the known JSON record and stamps `updatedAt`.

A native admin UI should be added next on a protected route that calls this endpoint. It must not expose the token to browser JavaScript; the preferred implementation is a server action or same-origin server route with an authenticated session. Until that UI and session layer exist, direct write access is intentionally disabled unless `NATIVE_ADMIN_TOKEN` is configured.

## Initial replacement record

The current record keeps `AKT!V`, uses `/framer-site/_deps/images/radar-aktiv-preloaded.webp`, preserves `contain` fit, and centers the image at `50% 50%`.

## Risks and follow-up

The JSON file is suitable for the current single-instance self-hosted preview but is not a multi-user database. Before collaborative editing or horizontal scaling, move the record to the project database with authenticated sessions, audit history, optimistic concurrency, and media storage. WordPress remains the publication CMS and is not removed from the architecture in this step.

---

