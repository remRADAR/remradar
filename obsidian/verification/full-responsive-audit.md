# Full-site responsive audit

## Scope

The production preview on port 3002 was audited through Chromium DevTools across all active routes and five tablet/desktop breakpoints: 768x1024, 1024x768, 1280x800, 1440x900, and 1920x1080. The tested routes were `/`, `/charts`, `/ontheradar`, `/magazine`, `/radarmusic`, `/store`, `/spotlights`, `/motherland`, and `/platforms`.

## Results

All 45 route-by-breakpoint records completed without probe errors. All nine routes returned HTTP 200. No outer-document horizontal overflow was detected at any route or breakpoint. The homepage’s embedded Framer document also reported no inner HTML or body overflow at all five breakpoints.

| Route group | Breakpoints | HTTP | Horizontal overflow | Notes |
|---|---:|---:|---:|---|
| Homepage `/` | 5 | 200 | None | Framer iframe ready; AKT!V image measured and centered |
| Content routes | 40 | 200 | None | Native route shells remained within viewport bounds |

## Homepage measurements

The homepage iframe filled the viewport width at every desktop/tablet breakpoint. The AKT!V image remained centered, used `object-fit: contain`, `object-position: 50% 50%`, and `transform: none`, with the full 16:9 ratio preserved.

| Viewport | Main width | Homepage iframe width | AKT!V image size | Outer overflow | Inner overflow |
|---|---:|---:|---:|---|---|
| 768x1024 | 768 | 768 | 768x432 | None | None |
| 1024x768 | 1024 | 1024 | 1024x576 | None | None |
| 1280x800 | 1280 | 1280 | 1280x720 | None | None |
| 1440x900 | 1440 | 1440 | 1440x810 | None | None |
| 1920x1080 | 1920 | 1920 | 1920x1080 | None | None |

Footer and navigation bounds remained inside the viewport at the homepage breakpoints. No padding or spacing regression was detected by the measured bounds. The remaining limitation is that this audit measured tablet and desktop only; phone-specific touch behavior and visual typography density were not re-run here because the request targeted remaining tablet and desktop breakpoints.

Preview: https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?review=aktiv-preload-final

---

