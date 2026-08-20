# remRADAR

## RADARCharts · Culture, music, and the living signal

**remRADAR** is an independent cultural platform and creative technology system built around the belief that music, visual culture, people, and ideas should be discovered as a connected signal rather than as isolated posts.

This repository contains the self-hosted **RADARCharts** platform: the public-facing digital home for remRADAR’s charts, publications, music intelligence, cultural archives, original media, store experiences, and evolving editorial projects. The site preserves the authored visual language of the original Framer experience while giving the platform a more durable Next.js foundation, a native component-replacement channel, and a controlled bridge to WordPress content.

> **RADAR is AKT!V. ©2026**

---

## What RADARCharts is about

RADARCharts is the discovery and editorial layer of remRADAR. It brings together the movements, releases, artists, stories, images, charts, and communities shaping the present cultural moment.

The platform is designed to feel more like an active visual environment than a conventional content-management website. Its homepage combines Framer-authored compositions, animated brand surfaces, logo tickers, chart experiences, publication modules, music content, archive sections, and a slim navigation dock. The result is a cinematic interface for following what is moving through music and culture now.

The current platform includes the following public areas:

| Area | Purpose |
| --- | --- |
| **Home** | The primary RADARCharts experience, including the welcome animation, Framer homepage, logo ticker, media sections, chart surfaces, and navigation dock. |
| **Charts** | Chart-led discovery and ranked cultural or music intelligence. |
| **Articles** | Editorial publications and the article stream connected to the WordPress content sources. |
| **Magazine** | Long-form editorial and archive-oriented publishing. |
| **RADARMusic** | Music-focused releases, stories, playlists, and artist-facing content. |
| **RadarStore** | The connected store experience and future commerce surface. |
| **Spotlights** | Focused profiles, moments, and cultural features. |
| **Motherland** | A dedicated cultural and geographic editorial space. |
| **Explore** | The broader platform index and discovery navigation. |

---

## The remRADAR brand

**remRADAR** is the brand and cultural point of view behind the platform. The name represents a continuous act of noticing: identifying emerging energy, preserving important context, and creating a visible path for people to find what deserves attention.

The brand is intentionally cross-disciplinary. It operates across music, editorial, visual identity, culture, community, technology, and commerce. RADARCharts is therefore not only a website; it is one public interface for a wider remRADAR system.

The design language is built around several durable principles:

| Principle | Meaning in the product |
| --- | --- |
| **Active discovery** | The interface should feel alive, directional, and in motion without becoming difficult to use. |
| **Editorial context** | Charts and media should lead to stories, people, releases, and deeper cultural understanding. |
| **Cinematic restraint** | Motion, glass surfaces, dark fields, typography, and image composition create atmosphere while preserving hierarchy. |
| **Human authorship** | Framer-authored compositions and visual decisions remain part of the product’s identity rather than being flattened into generic templates. |
| **Open-ended expansion** | New pages, media formats, store experiences, and editorial channels can be added without rebuilding the platform from scratch. |

---

## RADARMatrix

**RADARMatrix** is the strategic and operational intelligence layer for remRADAR. It connects brand direction, product engineering, visual systems, motion, editorial thinking, music-release intelligence, distribution, memory, and future automation into one coherent operating model.

RADARMatrix exists to ensure that the platform does not grow as a collection of disconnected pages or one-off experiments. It helps the project maintain continuity between what remRADAR believes, what it publishes, how it looks, how it behaves, and what it learns over time.

Its operating sequence is:

> **Outcome → Context → Specification → Build → Test → Verify → Report → Continue.**

In practical terms, RADARMatrix provides the following discipline:

| System lane | Responsibility |
| --- | --- |
| **Engineering control** | Inspect the repository, preserve architecture, implement changes safely, test critical paths, and verify the result in the actual browser. |
| **Visual intelligence** | Translate visual intent into design systems, motion behavior, image treatment, composition, and responsive implementation. |
| **Editorial and release intelligence** | Connect publications, charts, artists, music releases, cultural moments, audiences, and distribution decisions. |
| **Memory stewardship** | Preserve durable brand principles, accepted patterns, rejected alternatives, decisions, experiments, and open questions with provenance. |
| **Controlled automation** | Build future workflows around canonical content, approval gates, idempotency, auditability, rights checks, and reversible actions. |

RADARMatrix is not a separate consumer-facing page in the current site. It is the operating framework used to expand remRADAR coherently across product, brand, content, and future agent-assisted systems.

---

## Technical foundation

RADARCharts is a Next.js 16 application using the App Router and Tailwind CSS v4. The original Framer homepage is retained as the authored primary view and is served through a controlled iframe bridge. The bridge synchronizes the iframe height, applies native component replacements, handles the third-section media layer, and preserves the lower Framer components instead of replacing the homepage with a generic rebuild.

The platform uses WordPress as a content bridge for publications and navigation while reducing dependence on WordPress for homepage component control. A local native replacement channel at [`content/component-replacements.json`](./content/component-replacements.json) provides an independently editable source for selected homepage components.

| Layer | Current role |
| --- | --- |
| **Next.js 16 App Router** | Application shell, routes, server rendering, APIs, and deployment foundation. |
| **Framer export** | Authored homepage visual composition and page-level Framer surfaces. |
| **Framer bridge** | Height synchronization, runtime replacement, media activation, and responsive containment. |
| **Native component channel** | JSON-backed replacement data and protected API for selected homepage components. |
| **WordPress adapters** | Publication and navigation content from the active WordPress sources. |
| **Welcome gate** | Automatic cinematic opening animation with homepage preloading and fade transition. |
| **Self-hosted media** | Optimized WebM/MP4 assets and poster fallbacks served from the repository. |
| **Obsidian vault** | Project memory, architecture, workflows, decisions, and agent-facing guidance. |

### Homepage media performance

The animated third section uses a self-hosted compressed video representation of the supplied GIF rather than serving the original 191 MB GIF directly. The primary mobile asset is a 640×360 MP4, with a WebM fallback and a JPEG poster frame. The poster is preloaded during the welcome animation and remains visible while the video decoder initializes, preventing a blank section.

The reproducible conversion workflow is available at [`scripts/optimize_aktiv_media.py`](./scripts/optimize_aktiv_media.py).

---

## Getting started

The project expects **Node 22.13+** and Yarn.

```bash
git clone https://github.com/remRADAR/remradar.git
cd remradar
yarn install
cp .env.example .env
yarn dev
```

The development server runs at `http://localhost:3000` by default. A production-style local preview can be started with:

```bash
yarn build
yarn start
```

Available scripts include:

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start the development server. |
| `yarn lint` | Run ESLint. |
| `yarn build` | Create the production build. |
| `yarn start` | Serve the production build. |

Environment variables are documented in [`.env.example`](./.env.example) and the project guide at [`obsidian/architecture/environment-variables.md`](./obsidian/architecture/environment-variables.md).

---

## Repository map

| Path | Description |
| --- | --- |
| [`src/app`](./src/app) | App Router pages, layouts, and API routes. |
| [`src/components/site`](./src/components/site) | Site shell, Framer bridge, welcome gate, footer, and navigation components. |
| [`src/lib`](./src/lib) | Native content and integration helpers. |
| [`content`](./content) | Editable native component replacement data. |
| [`public/framer-site`](./public/framer-site) | Self-hosted Framer export and its local assets. |
| [`scripts`](./scripts) | Repeatable media, migration, and maintenance utilities. |
| [`obsidian`](./obsidian) | The project’s durable documentation and operating memory. |

Start with [`obsidian/README.md`](./obsidian/README.md) for the vault map and [`obsidian/workflows/ai-agent-guide.md`](./obsidian/workflows/ai-agent-guide.md) for the hard rules governing repository changes.

---

## Working principles

Changes to RADARCharts should preserve the authored visual direction, avoid unnecessary rewrites, and be verified in the real rendered experience. Every meaningful change should consider loading, responsive behavior, accessibility, reduced motion, failure states, content ownership, and rollback.

The site is intentionally being migrated in stages. WordPress remains useful for publication content, while the native channel gradually takes ownership of editable homepage components and other product surfaces. This allows remRADAR to reduce server-side dependency without sacrificing the existing editorial workflow or the authored Framer experience.

When extending the platform, use the following sequence:

> **Understand → Inspect → Plan → Build → Test → Debug → Review → Verify → Continue.**

---

## Status

The main branch contains the current self-hosted RADARCharts migration, including the Framer homepage bridge, automatic welcome animation, responsive section alignment, native component replacement channel, optimized third-section media, and the glass navigation footer.

The platform remains an active build. Future work includes expanding the protected native admin interface, completing the migration of additional editable component data, deepening WordPress synchronization, and continuing the RADARStore and editorial platform development.

---

## License and ownership

This repository is maintained for the remRADAR project. Unless a separate license file states otherwise, the source, brand assets, editorial materials, media, and visual identity should be treated as project-owned materials and should not be redistributed without permission.
