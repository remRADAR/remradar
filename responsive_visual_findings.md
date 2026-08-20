# Responsive screenshot findings

The 360px and 390px captures both show the preserved Framer hero and RADARCharts wordmark, but the lower homepage components are not visible within the captured viewport. The logo strip reaches the bottom edge and the slim footer is below the visible frame, indicating that the issue is not a replacement homepage but a page/iframe height and capture-flow problem.

The mobile hero itself is not horizontally overflowing: the artist list remains within the left side, the category list remains within the right side, and the face/wordmark composition stays centered. The current visual is very dark and vertically tall, but it is not visibly overlapping at the captured top section.

The next diagnosis must inspect the actual iframe height after Framer hydration and ensure the outer page exposes the complete Framer document height. The Framer internal document has more content below the captured hero/logo strip, so the bridge should not clip or collapse its lower sections.
