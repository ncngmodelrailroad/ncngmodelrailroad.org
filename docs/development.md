# Development Guide

This guide walks you through setting up the site on your own computer so you can preview changes before they go live.

---

## Prerequisites

You need two things installed:

1. **Node.js** (version 22.19 or newer; CI uses Node 22) - [Download here](https://nodejs.org/)
2. **Git** — [Download here](https://git-scm.com/)

To check if you have them:

```sh
node --version   # should print v22.19.0 or higher
git --version    # should print git version 2.x.x
```

---

## Setup (first time only)

### 1. Clone the repository

```sh
git clone https://github.com/djdefi/ncngmodelrailroad.org.git
cd ncngmodelrailroad.org
```

### 2. Install dependencies

```sh
npm install
```

This downloads all the libraries the site needs. It creates a `node_modules/` folder (which is ignored by git — don't commit it).

---

## Day-to-day workflow

### Start the dev server

```sh
npm run dev
```

This starts a local server at **http://localhost:4321/**. Open that URL in your browser.

The dev server **live-reloads** — when you save a file, the browser updates automatically. No need to restart.

### Build for production

```sh
npm run build
```

This generates the final static site into the `dist/` folder. This is what gets deployed to GitHub Pages.

### Preview the production build

```sh
npm run preview
```

Serves the `dist/` folder locally so you can verify the production build looks right.

---

## How the site is built

### Tech stack

| Technology | Role |
| :--------- | :--- |
| [Astro](https://astro.build/) | Static site generator — turns `.astro` files into HTML |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for styling |
| [astro-icon](https://github.com/natemoo-re/astro-icon) | Icon component using [Iconify Solar](https://icon-sets.iconify.design/solar/) set, plus [Simple Icons](https://icon-sets.iconify.design/simple-icons/) for brand marks |
| GitHub Pages | Free static hosting, auto-deploys on push |

Astro 7 uses Vite 8 and the Rust template compiler. The site keeps `output: 'static'` and `compressHTML: true` to preserve static hosting and HTML-aware whitespace handling. Markdown uses the explicit `unified()` processor from `@astrojs/markdown-remark` with `rehype-sanitize`, preserving the sanitization used before Astro 7.

After changing dependencies, regenerate the lockfile for the Linux CI runner:

```sh
npm install --package-lock-only --os=linux --cpu=x64
```

Keep transitive security fixes within their parent dependency ranges where possible. Use `package.json` overrides when a required fix falls outside those ranges.

### Key concepts

**Pages** (`src/pages/`) — Each `.astro` file becomes a URL. `about.astro` → `/about`.

**Layouts** (`src/layouts/BaseLayout.astro`) — The shared wrapper around every page. Contains the header, navigation, footer, SEO meta tags, and structured data (schema.org).

**Components** (`src/components/`) — Reusable UI pieces like `Button.astro` and `SectionHeader.astro`.

**Config** (`src/config/`) — Centralized data imported across the site:
- `organization.ts` — Org name, address, contact info
- `navigation.ts` — Nav items shared by desktop and mobile menus

**Content** (`src/content/`) — Markdown content collections: `events/`, `board/`, `gallery/`, `trains/` (engine roster), and `learn/` (guides). Each `.md` file has frontmatter (YAML between `---` lines) and body text. Glossary terms live in `src/data/glossary.yaml`.

**Styles** (`src/styles/global.css`) — Global CSS with Tailwind imports and custom theme:
- Colors: Primary `#8A1F17`, Secondary `#8B5E34`, Accent `#2F5D46`, Gold `#B9821B` (defined as CSS variables; see the `@theme` and `:root` blocks)
- Fonts: Archivo Black (headings), Libre Franklin (body, variable weight axis)
- Button classes: `.btn-primary`, `.btn-outline`
- See **[`docs/design-system.md`](design-system.md)** for the full token and component reference, and the live **`/styleguide`** page (noindex) which renders every token and component.

**Images** (`public/images/`) — Static files served as-is. No processing by Astro. Keep images optimized (800px wide, <200KB for gallery).

**AI site guide** (`src/pages/llms.txt.ts`) - Generates `/llms.txt` as a static Markdown-formatted text file during the build. It uses the shared organization config and Astro's `site` URL, and lists key public pages with visit-planning caveats. Update its curated links and descriptions when routes or their purpose change; keep event dates, hours, prices, and board names on their source pages. The shared layout and standalone map page link to the guide with `rel="describedby"`. This follows the [llms.txt proposal](https://llmstxt.org/), but does not change crawler permissions in `public/robots.txt` or guarantee AI service support.

### Machine-readable data

`/llms.txt` links to `/data/catalog.json`, a JSON catalog of downloadable datasets. The catalog includes field descriptions, formats, source links, caveats, and counts derived from the map files at build time. The shared layout advertises the catalog with `rel="describedby"`; the Events, Trains, Glossary, and standalone map pages also advertise their datasets with `rel="alternate"`.

| URL | Contents | Source |
| :-- | :------- | :----- |
| `/data/catalog.json` | Dataset index and field descriptions | `src/config/data.ts` and the map files |
| `/data/events.json` | All published event entries, including past events | `src/content/events/` |
| `/data/trains.json` | Historical locomotive roster | `src/content/trains/` |
| `/data/glossary.json` | Terms, definitions, categories, and term links | `src/data/glossary.yaml` |
| `/map/extracted/ncng_historical_route_lines.geojson` | Historical track segments | Existing map asset |
| `/map/extracted/ncng_historical_reference_features.geojson` | Historical stations and reference features | Existing map asset |

The three content feeds use a versioned JSON envelope with `schemaVersion`, `generatedAt`, `catalogUrl`, `usagePolicyUrl`, `snapshotNote`, `id`, `name`, `description`, `url`, `sourcePageUrl`, `caveats`, and `items`. The event feed also includes the venue's IANA `timeZone`. Optional content fields are explicit `null` values. Entry IDs come from their content sources; do not derive dates or other facts from filenames. The catalog describes each item's fields. Event and train feeds follow date and roster order respectively, with ID as a tie-breaker; glossary entries sort by ID.

These files are snapshots from `npm run build`, not live APIs. `generatedAt` records generation, not source verification. Event dates are local calendar dates, not opening-hour timestamps. `date` and `endDate` retain host event dates. Optional `layoutStartDate` and `layoutEndDate` record confirmed layout days separately; null means no date was provided. The feed does not infer layout opening hours, admission prices, future recurrences, or upcoming/past status. For a confirmed opening, compare `layoutEndDate` (or `layoutStartDate` for a single day) with today's date in the feed's `timeZone`. Otherwise, use `endDate` or `date` to determine whether the host event has passed, without assuming the layout opens on those days. Regular work sessions and full event bodies remain on the Events page.

Map downloads remain their original GeoJSON, without a feed envelope or duplicate copies. Coordinates use WGS84 in longitude, latitude order. Track segments are not an ordered navigable route; reference features include points, lines, and polygons. Preserve original source credits and caveats. Source descriptions can contain HTML and must be sanitized before rendering. Do not interpret map geometry as public access, surveyed boundaries, or the model layout track plan. This catalog does not grant a new license to third-party data.

To update the published data, edit its existing source. Dataset descriptions, field descriptions, and caveats live in `src/config/data.ts`; feed generation lives in `src/pages/data/`. Keep these descriptions aligned when collection fields change, and increment `dataSchemaVersion` for breaking feed-contract changes. The catalog deliberately covers the route, historical reference features, and the three content feeds, not board records or parcel-level data.

The public `/content-use` page explains attribution, considerate crawling, source accuracy, reuse limits, and optional support. Its copy and support links come from `src/config/contentUse.ts`, shared with `/llms.txt` and the catalog's `usage` object. Every content feed links to the page through `usagePolicyUrl`, and the site footer links to it for readers. These are advisory requests, not crawler enforcement, a donation requirement, or a new copyright or AI-training license. Crawler rules remain in `public/robots.txt`; hosting or CDN configuration, not this page, controls rate limiting.

### Architecture diagram

```
Browser Request
       ↓
GitHub Pages (static files in dist/)
       ↓
Built by: npm run build
       ↓
Astro reads:
  ├── src/pages/*.astro        → HTML pages
  ├── src/layouts/BaseLayout   → wraps each page
  ├── src/components/*         → reusable UI
  ├── src/config/*             → org data, nav
  ├── src/content/*/*.md       → content collections (events, board, gallery, trains, learn)
  ├── src/styles/global.css    → theme
  └── public/*                 → images, favicon (copied as-is)
```

---

## Deployment

The site deploys automatically via **GitHub Actions**:

1. You push a commit to the `main` branch
2. GitHub Actions runs `npm run build`
3. The `dist/` folder is published to GitHub Pages
4. Live at [ncngmodelrailroad.org](https://ncngmodelrailroad.org/) within ~2 minutes

You don't need to do anything special — just push to `main`.

### Custom Domain

The site uses a custom domain (`ncngmodelrailroad.org`) configured via the `CNAME` file in `public/` and the `site` field in `astro.config.mjs`. Since the site is at the root domain, no `base` path is needed — internal links and images use root-relative paths.