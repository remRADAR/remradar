# Circular Wave footer verification

The long footer has been replaced with a compact RADARCharts circular navigation dock inspired by the supplied Circular Wave component.

The dock contains seven semantic route icons: Home, Charts, Articles, Magazine, RADARMusic, Store, and More. Each icon has an `aria-label`, title, keyboard focus state, and an inline SVG icon matched to its destination. The dock is not fixed or sticky; it remains in normal document flow below the preserved Framer homepage.

The visual preview shows the Framer homepage followed by a single slim circular footer with a low-amplitude wave offset across the icons and the line “The RADAR never sleeps.” The previous long text-column footer is not visible.

Desktop measurement: seven icons, outer document scroll width 1265px and client width 1265px, with the dock’s internal scroll width only 5px wider than its client width due to the hidden horizontal rail. The rail is intentionally overflow-safe and hides the scrollbar; the desktop dock remains visually centered.

A simulated 390px Framer iframe width preserved the same footer bounds and outer document width without creating page-level horizontal overflow. The responsive dock is designed to keep the icon row on one line and allow safe internal scrolling if a very narrow device cannot fit all seven icons.
