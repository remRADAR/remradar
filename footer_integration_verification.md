# Footer integration verification

The imported Framer homepage hydrates its original footer dynamically as `.framer-1eadyix`; it is not present as a static semantic `<footer>` in the exported HTML. The local bridge now includes `.framer-1eadyix { display: none !important; }`, which removes it from layout after hydration.

The browser DOM check confirmed:

- Original Framer footer nodes: 1
- Visible original Framer footer nodes: 0
- Replacement Next footer nodes: 1
- Outer document body scroll height: 1556px

The visual preview shows the preserved Framer hero, RADARCharts wordmark, logo strip, and audio control flowing directly into one Liquid Glass Footer. The duplicate black Framer footer is no longer visible, and the replacement footer is not fixed or sticky; it remains in normal document flow below the Framer iframe.

The replacement footer still contains the existing RADAR route groups and social links. The Framer iframe remains the main site view, while the outer Next shell owns the replacement footer and the background layer.
