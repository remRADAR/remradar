# AKT!V wide image verification

The supplied 16:9 `Photoroom_20260719_115520PM(convert.io).webp` was copied to `public/framer-site/_deps/images/radar-aktiv-wide.webp`. The runtime override now sets the image to 100% width and height with `object-fit: cover` and centered positioning. Active Framer documents reference the wide asset and no longer reference the square asset.

Lint and production build passed. The public preview at https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?preview=aktiv-wide-final loaded the homepage and the browser reached the AKT!V section. The wide stadium image fills the existing rounded frame without visible blank gaps; the AKT!V label remains visible. The crop emphasizes the stadium because the authored frame is taller than 16:9, which is the expected cover-fit behavior.

Source: local build output and public browser preview at the URL above.

---

