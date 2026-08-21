# Footer and Inner-Page Logo QA

The current footer contains nine navigation items and already supports horizontal overflow on mobile. The redesign target is a slim, full-width glass tray that retains all routes but uses white glyphs, a black active state, and stable safe-area spacing.

The current inner-page headers in `framer-route-page.tsx` and `radar-store-page.tsx` use `/radarcharts-logo.webp` with `object-fit: cover` inside a gray-backed 3:2 container. The available `/radarcharts-logo.png` is RGB rather than RGBA and visibly includes a gray background, so it is not transparent. A dedicated transparent PNG must be generated or derived, and the image CSS should switch to contain/auto sizing so it does not crop the logo.

The homepage hero and Framer composition should remain untouched while footer and inner-page brand surfaces are updated.
