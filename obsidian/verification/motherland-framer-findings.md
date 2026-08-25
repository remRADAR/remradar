# Motherland Framer source findings

Source inspected: https://radarcharts.framer.website/motherland

The original Framer page is titled `RADARCharts by REM - Protect The Music` and is not a basic static page. Its primary authored content includes a large, mostly black hero with the heading `The MOTHERLand`, the sublabel `[ RADARCharts 2025 ]`, and a long mission statement about uplifting, uniting, and unleashing the potential of women in entertainment. The page includes a visually rich hero canvas with an accessible description of a close-up astronaut face inside a reflective helmet.

The visible page structure includes the Motherland hero, a long editorial mission block, an embedded Spotify-like playlist/player with album art, track rows, play controls, previous/next controls, save and more controls, and a substantial track list. The original Framer page also includes branded RADARCharts messaging, `Explore charts` and `Read articles` calls to action, and grouped footer navigation under Platform, Discover, and Network.

The original content extracted from the page includes the footer statements `© 2026 RADARCharts. Built for culture in motion.` and `The RADAR never sleeps.` The footer links include Home, Charts, Platforms, Playlists, Store, Articles, Magazine, Spotlights, RADARMusic, Motherland, About, Contact, and Editorial archive.

At the inspected desktop viewport, the hero and mission section use an immersive black composition with centered typography and generous vertical pacing. The embedded music component is a major part of the page identity and should not be replaced by a plain text list. Its visible controls include play, previous, next, save, more, Spotify, and track-level play buttons.

The existing remradar implementation currently uses a generic native `FramerRoutePage` definition for Motherland with one short section (`RADARCharts 2025`) and does not yet reproduce the original Motherland hero canvas, long mission copy, or embedded playlist/player. This is the primary adaptation gap.
