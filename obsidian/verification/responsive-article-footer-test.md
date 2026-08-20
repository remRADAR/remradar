# Responsive article and footer test

Date: 2026-08-18

## Initial capture status

The existing headless capture matrix generated 360x800, 390x844, and 768x1024 screenshots, then hung while capturing the desktop sizes. The batch was stopped after preserving the completed artifacts.

## Mobile findings

At 360x800 and 390x844, the preserved Framer hero remains scaled within the viewport without horizontal clipping. Typography and hero navigation remain inside the image bounds. The captured viewport ends before the article stack and footer dock, so these screenshots alone cannot verify lower-page article/footer behavior. A full-page or scroll-position capture is required for those elements.

## Tall viewport findings

At 390x2200, the preserved Framer page remains horizontally contained. The lower part of the screenshot reaches the hero/editorial image and Top 25 block but not the article stack; the mobile page is substantially taller than the capture and requires scroll-position testing to inspect the article component directly.

At 768x2200, the footer dock is visible at the bottom edge. It appears as a compact horizontal dock without wrapping, but only the first visible set of labels is readable in the screenshot because the dock is horizontally scrollable. The preserved Framer hero and editorial image remain contained, while the lower page continues beyond the screenshot.

The current capture method is viewport-height based rather than a true scroll-position/full-document capture. A second test using DOM measurements and controlled scroll positions is needed to assess the article stack itself and confirm footer overlap at the lower page boundary.
