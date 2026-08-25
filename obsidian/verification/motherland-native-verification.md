# Native Motherland route verification

Local production route inspected: `/motherland` on the port-3025 preview.

The route rendered with the dedicated Motherland page rather than the generic native route placeholder. The browser-visible element inventory confirmed the home logo link, `HOME`, `EXPLORE CHARTS`, `READ ARTICLES`, the complete grouped archive links, and the shared floating dock links for Home, Charts, Articles, Magazine, RADARMusic, RadarStore, Spotlights, Motherland, and Explore.

The route built successfully with Next.js and the asset verification gate. The route page contains the rich hero, long manifesto, Spotify playlist iframe, featured track rows, image-led CTA, archive groups, footer statements, and the shared footer navigator. The Spotify iframe is lazy-loaded and has an explicit accessible title plus autoplay-related permissions. The visual browser screenshot transport returned `about:blank` after the initial navigation, so a screenshot-level visual comparison of the local native page is UNVERIFIED in this pass even though the route DOM rendered and its visible controls were enumerated.
