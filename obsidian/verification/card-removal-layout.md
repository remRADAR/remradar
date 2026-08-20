# Card removal and frame alignment verification

The recently attached Framer article card stack was removed from the homepage shell and from the active exported Framer documents. The article slot, card selectors, RADARARTICLES label, and Expand articles control are absent from the served output. Lint and the production build pass. The refreshed public preview loads the updated AKT!V homepage content and shows the authored hero/navigation sequence without the card stack or its reserved article frame.

Preview: https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?preview=card-removed

The browser viewport reports no article card elements and the page remains within the existing authored frame sequence. A full multi-viewport pass remains appropriate before deployment, but no card-induced blank frame is present in this preview.

Sources: local served output and public browser preview at the URL above.

---

