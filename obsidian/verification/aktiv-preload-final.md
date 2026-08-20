# AKT!V optimized asset and intro preload verification

The supplied `Photoroom_20260820_92233AM(convert.io)(1).webp` was optimized and installed as `public/framer-site/_deps/images/radar-aktiv-preloaded.webp`. The output is 2560x1440 WebP, served at 227,216 bytes with `Content-Type: image/webp` and HTTP 200 from the production preview.

The welcome gate now emits a high-priority image preload link for the AKT!V asset while the intro video is playing. The homepage response contains three references to `radar-aktiv-preloaded.webp` and two preload hints. The runtime Framer bridge and all active Framer HTML copies use the same asset path, preventing hydration/source divergence.

Lint and production build passed. The local production server on port 3002 returned HTTP 200 for the homepage and HTTP 200 for the optimized image. A later browser target returned about:blank after public navigation even though the local server and asset endpoint remained healthy; this is recorded as a browser-proxy observation, not an image-server failure.

Source: local production response, asset headers, build output, and public preview URL https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?review=aktiv-preload-final.

---

