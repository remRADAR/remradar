# Layout audit 06 — rendered findings

Source inspected: https://remradar-git-main-remradars-projects.vercel.app/?layout-audit=06

The rendered homepage was inspected at the current desktop browser viewport before source changes. The Liberty panel is rendered at approximately 1188.8 x 668.7px with a 16:9 ratio, begins immediately after the logo ticker with a compact visible transition, and the local liberty PNG is visible inside the rounded panel without image distortion. The panel’s following status/content block begins directly below the panel; no large blank spacer was visible in the rendered desktop view.

The lower homepage contains an animated magazine-cover carousel in a rounded section. The rendered screenshot shows multiple covers fully visible inside the carousel viewport, including their lower edges, and the horizontal gliding composition remains present. The lower section is followed by the RADARMusic media block, another image carousel, and the floating footer. The footer remains visible at the bottom without page-width overflow.

The browser console DOM audit reported page width equal to client width at 1280px. The Liberty panel had `overflow: hidden`, 32px radius, zero fixed descendants, and the local `/media/liberty-statue.png` with `object-fit: contain` and bottom-centered positioning. The embedded Framer category section has a 500px outer height with 56px top and 72px bottom padding, while its inner carousel viewport is 370px high and animated covers can reach roughly 333px high. This is the key candidate for a targeted carousel viewport/padding correction if mobile or narrow captures reproduce clipping.

The desktop scroll inspection did not establish a reproducible huge gap before the Liberty panel or definitive cover clipping in the current live Vercel state. Narrow/mobile and post-transition viewport validation remains required before altering layout rules, to avoid changing an already-correct desktop composition.
