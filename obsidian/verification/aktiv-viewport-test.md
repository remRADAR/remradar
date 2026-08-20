# AKT!V desktop and mobile viewport test

The refreshed production preview was tested at 1440x900, 1024x768, 390x844, and 412x915 through Chromium DevTools. At every viewport, the preload link was present, the Framer iframe reported ready, the image used `object-fit: contain`, `object-position: 50% 50%`, and `transform: none`, and horizontal overflow was false.

| Viewport | Rendered image | Ratio | Preload | Overflow |
|---|---:|---:|---|---|
| 1440x900 | 1440x810 | 1.7778 | Present | None |
| 1024x768 | 1024x576 | 1.7778 | Present | None |
| 390x844 | 390x219.375 | 1.7778 | Present | None |
| 412x915 | 412x231.75 | 1.7778 | Present | None |

These results confirm full-image scaling and centering without distortion or crop at the tested viewport sizes. The probe’s outer-document `homepageMounted` selector is not applicable because the homepage is inside the Framer iframe; the iframe itself reported ready in all four runs.

Preview: https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?review=aktiv-preload-final

---

