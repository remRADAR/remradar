# Main live render audit — 2026-08-20

The main-branch preview at `?review=main-live-audit-20260820` loaded the homepage shell and Framer iframe. The browser DOM reported the iframe as loaded with `scrollHeight=3948`, but the iframe had `img=99`, `video=0`, and `source=0`. The native replacement error element existed but was hidden. The iframe source was `/framer-site/aktiv-section-v4.html?v=aktiv-section-8`.

The visible page included the logo ticker, `NOW READING...`, lower music/player content, and footer navigation. The expected GIF-derived media was not present as a video element. The bridge currently finds a paragraph containing `Experience the perfect fusion` or exact `AKT!V`; it then searches the closest `.framer-50j9t5-container` for an image and replaces it only if an image exists. The live result indicates the selector is not reaching the intended third section or the intended static image is absent, so no video is injected.

The iframe reports headings including `RADARCharts`, `Experience the perfect fusion...`, `RDR`, `TOP25`, `ARTICLES`, and lower Framer content, but no visible `AKT!V` heading after the replacement text is blank. Further static HTML and DOM inspection is required to locate the correct third-section anchor and lower-component visibility rules.

## Final bridge verification — 2026-08-20

After moving the bridge into a React client effect and constraining the original fixed parallax layer, the live browser reported an iframe height of 3754 px matching its document scroll height. The third-section container measured 1225×689.0625 px, an exact 16:9 ratio. The looping WebM measured 1225×689.0626 px, also an exact 16:9 ratio, had `readyState=4`, and `paused=false`. Its active source was the self-hosted `/framer-site/_deps/images/aktiv-section-loop.webm`. The third section had no text overlay. Lower Framer content remained present, including `RDR`, `TOP25`, `ADD IMAGE`, `NOW READING...`, the music footer copy, and `TELMAN - Moov Different`.
