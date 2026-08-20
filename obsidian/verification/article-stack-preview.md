# Article stack preview findings

## 2026-08-18

The first static placeholder insertion was removed by the hydrated Framer export, so the parent portal could not find it. A hydration-safe DOM bridge was added to `public/framer-site/index.html`; it finds the authored `ARTICLES` anchor after hydration, hides that CTA, and recreates `#radar-article-stack-slot` when needed.

After a full preview reload at `http://localhost:3000/?preview=article-stack-bridge`, the live page exposes the slot and four card links inside the iframe. The browser-visible content now includes `RADARARTICLES`, `Expand articles`, four article cards, and the authored `NOW READING...` link immediately after the card stack. The page reports 3324 pixels below the viewport, indicating the iframe bridge expanded the page rather than cropping the inserted content.

The card stack currently uses fallback editorial data when the WordPress endpoint returns no usable posts. This keeps the layout testable while the CMS adapter remains read-only and failure-tolerant.

The first expanded-state measurement exposed a real overlap: the slot height was 650px, but each absolutely positioned card inherited the full 600px stack-area height. The fourth card therefore extended to iframe y=3502 while `NOW READING...` began at y=2989. The authored parent also reports `overflow: clip`, so the fix is to give expanded cards a compact fixed height and keep their translated bottoms before the following authored block.

The live DOM confirms the following section is a sibling of `#1k80cd9`, not a descendant. The stack slot is the last child of `#1k80cd9`, whose computed height remained 2041px; `#hz7xvy` begins at y=3096 while the fourth card ends at y=3042, causing a 53px overlap. The previous parent selector was scoped through a sibling `.framer-sVFBc` and therefore did not match. The corrective rule must target `.framer-1k80cd9` directly.

Final expanded-state verification after the clearance rule: four cards render; the fourth card ends at y=3042, `NOW READING...` begins at y=3053, yielding an 11px positive gap; the iframe height is 4680px. The slot bottom is y=3058, so Now Reading begins 5px above the nominal slot bottom but still clears the translated cards. The live browser reports zero Next issues at this preview state.

Automated verification passed: `yarn lint` and `yarn build` both completed successfully, with Next.js 16.3.1 compiling the homepage and `/api/articles` route. The local API returned `{\"articles\":[]}` because the sandbox could not reach the public `radarcharts.net` REST endpoint: standard curl failed certificate verification and a diagnostic `curl -k` request timed out after 10 seconds. The application therefore correctly falls back to local editorial placeholders; live CMS content remains UNVERIFIED until the WordPress endpoint is reachable from the deployment environment.

## Full-frame refit 2026-08-18

The article slot was widened from the prior 440px island to the full iframe width. Final collapsed desktop measurement: iframe 1265px, article slot 1265px wide from x=0 to x=1265, height 304px, matching the authored editorial frame height. The article card area fills the frame at 266px beneath its compact header. `NOW READING...` begins at y=2715, three pixels after the article frame ends at y=2712.

The expanded state keeps all four cards at full frame width and uses the existing 650px flow height; the fourth card remains above the following authored section with the previously verified positive clearance. A dedicated max-width 640px rule makes the slot width 100%, resets the mobile margin to -16px, keeps the collapsed frame at 304px, and expands to 610px without relying on viewport-specific fixed widths. The desktop edge offset is scoped to min-width 641px, so mobile remains centered.
