# Published Framer route and spacing findings

Date: 2026-08-18

The published source `https://radarcharts.framer.website/` is reachable and renders the same authored homepage structure as the local clone. Browser extraction exposed the active navigation labels: Home, Charts, Platforms, Playlists, Store, Articles, Magazine, Spotlights, RADARMusic, Motherland, About, Contact, and Editorial archive. The visible homepage CTA links are `./ontheradar` for Articles and `./magazine` for Now Reading; the local cloned index additionally contains `./charts` and `./radarmusic` links.

The published homepage contains the authored hero slideshow, RADARCharts logo band, culture/storytelling introduction, Top 25 section with an image slot, Articles CTA, Now Reading card group, and footer navigation. The spacing rhythm should be treated as the visual reference; the local clone should preserve this authored spacing rather than globally reflowing the Framer layout.

The published source exposes multiple Framer-hosted assets, including the hero image, repeated logo strip assets, Top 25 image, Now Reading images, and supporting content images. The published page is a single homepage document from the browser’s perspective; internal routes must be checked individually before cloning.
