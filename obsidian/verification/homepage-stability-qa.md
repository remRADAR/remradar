# Homepage Stability QA

The homepage debug pass inspected the Framer bridge, hero frame, glass section sizing, footer, preload hints, and sustained runtime behavior.

The sustained runtime scan exposed a minified React 405 early-update exception in the embedded Framer export and a loading fallback that could be surfaced by transient bridge exceptions. The bridge was hardened by delaying replacement mutations until after Framer hydration, coalescing ResizeObserver and MutationObserver work through requestAnimationFrame, making iframe height writes idempotent, limiting settling passes, and preventing transient replacement exceptions from blanking the entire homepage. The actual iframe error event remains the path for the hard loading fallback.

The root and exported-Framer video preloads were removed because Chromium reported unsupported/unused preload warnings. The browser refresh after the final build rendered the homepage content, hero composition, logo ticker, audio control, footer navigation, and RADAR footer note without the visible loading fallback.

Route smoke checks returned HTTP 200 for `/`, `/charts`, and `/api/homepage-components`. The homepage build passed lint, TypeScript, production build, and diff checks. The runtime harness produced null dimension samples due its iframe-scoped evaluation path, so numeric glass-box dimensions from that harness are UNVERIFIED; browser inspection showed the main page and footer remained contained with no obvious horizontal overflow.
