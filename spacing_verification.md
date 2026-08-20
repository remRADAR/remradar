# Framer spacing verification

The local Framer bridge now applies a targeted responsive rhythm override without changing the authored component structure.

Live measurements at the current 1265px iframe width:

| Element | Measurement |
| --- | --- |
| `NOW READING...` font size | 12px |
| `NOW READING...` line height | 16.8px |
| `NOW READING...` letter spacing | normal |
| Editorial rail height | 520px |
| Article card container height | 303.594px |
| Label width | 96px |
| Outer document width | 1265px |
| Outer scroll width | 1265px |

The spacing bridge tightens the original editorial block gap and padding, reduces the rail height using responsive `clamp()` rules, sets the requested 12px label size, and uses a smaller mobile rail/card footprint at widths below 640px. The authored Framer DOM and interactions remain intact.
