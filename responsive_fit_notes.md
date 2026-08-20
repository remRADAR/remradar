# Responsive fit audit

The outer page has no horizontal overflow at the current desktop viewport: document client and scroll widths are both 1265px.

The imported Framer document has a responsive viewport meta tag (`width=device-width`) and its own media-query breakpoints. Simulating a 390px iframe width produced an inner client width of 390px and an inner scroll width of 390px, indicating no horizontal overflow in the Framer document at that width.

The replacement footer has a responsive three-column navigation grid and no horizontal overflow in the current desktop measurement. Its links remain within the footer bounds.

A remaining issue was found in the iframe-height bridge: the Framer document reports approximately 4450px of content height, but the outer iframe remains at a 1px inline height with a 1100px CSS minimum height. The parent message listener did not respond to a direct test message, indicating the client-side bridge effect is not active or is not hydrating in the preview. This is the next issue to fix; it causes the outer page to clip/truncate the imported Framer content and makes the footer positioning unreliable.
