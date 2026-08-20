# Framer-first preview findings

Verified on Aug 18, 2026 through the public Next preview.

- The preserved Framer homepage is rendering as the primary view inside the imported main-view bridge.
- The Framer content is visible, including the black-and-white artist hero, RADARCharts wordmark, ecosystem logo strip, and audio control.
- The original Framer footer is absent from the imported view.
- The replacement RADARCharts Liquid Glass Footer is visible beneath the Framer content with Platform, Discover, and Network columns.
- The replacement footer has dark glass styling, rounded shell, border, brand copy, CTA, social links, and the RADAR footer line.
- The page has a dark graphite background behind the composition. The gradient layer is present in the Next shell, while the imported Framer visual itself remains dominant.
- The screenshot still shows a non-zero amount of content below the current viewport after scrolling to the end, so iframe-height synchronization should be checked again before declaring full-page sizing complete.
- No original `dist-original` file was changed; the working copy is under `public/framer-site/index.html`.
