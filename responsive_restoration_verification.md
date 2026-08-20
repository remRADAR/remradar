# Responsive restoration verification

The direct server-rendered Framer height bridge restored the complete imported homepage document.

Live preview measurements after hydration:

- Outer viewport width: 1280px
- Outer document client width: 1265px
- Outer document scroll width: 1265px
- Outer document scroll height: 4608px
- Framer iframe client width: 1265px
- Framer iframe client height: 4450px
- Framer inner document width: 1265px
- Framer inner document height: 4450px
- Framer inner scroll width: 1265px
- Replacement footer top: 4492.65625px
- Replacement footer bottom: 4608.390625px
- Footer width: 682.65625px
- Footer scroll width: 683px

The iframe now matches the full Framer document height instead of remaining at a 1px inline height with only the CSS minimum height visible. This allows the lower Framer homepage components to be reached by scrolling and keeps the replacement footer after the complete Framer page.

The 360px and 390px screenshots show the hero and wordmark fitting inside the viewport without visible horizontal overlap. The Framer document uses `width=device-width` and its responsive CSS, so the main view is not being desktop-scaled into mobile; it is rendered at the device width.

## Visual viewport captures

The 768px tablet capture shows the preserved Framer hero, centered RADARCharts wordmark, logo strip, and the next Framer content section beginning below; the original components are present rather than replaced. The 1440px desktop-wide capture shows the same Framer composition scaled to the wide canvas with the central hero image and side navigation lists remaining aligned. No visible horizontal clipping or component overlap was observed in these two captures.
