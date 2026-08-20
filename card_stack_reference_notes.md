# Card Stack Expand reference

Source wrapper: https://framer.com/m/Card-Stack-Expand-q0qD.js@KXm9hwapE3ek07XtMQLy
Underlying module: https://framerusercontent.com/modules/fJ07Qy5Sn5SsiDU98iP6/KXm9hwapE3ek07XtMQLy/rK5E4OfFh.js

The referenced component is a four-card stack wrapper with a default and hover state. It uses four cards, progressive scale values of approximately 0.85, 0.90, 0.95, and 1.0, staggered vertical offsets, and a hover expansion where the cards spread vertically and scale to 1. The component accepts per-card image, headline, category, excerpt, background color, and link inputs. It uses Framer Motion spring/tween transitions and defaults to a 385px-wide by 145px-high wrapper in the supplied module.

For RADARCharts, the component should be adapted rather than imported directly: WordPress normalized article records should provide the four card image/headline/category/excerpt/link values, while the preserved Framer article section determines the surrounding layout. The current Framer source includes an ARTICLES button followed by a NOW READING slideshow; the article button is the intended replacement boundary, and the following slideshow must remain visible and un-cropped.
