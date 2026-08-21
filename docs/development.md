# Development Guide

This guide walks you through setting up the site on your own computer so you can preview changes before they go live.

---

## Prerequisites

You need two things installed:

1. **Node.js** (version 18 or newer) — [Download here](https://nodejs.org/)
2. **Git** — [Download here](https://git-scm.com/)

To check if you have them:

```sh
node --version   # should print v18.x.x or higher
git --version    # should print git version 2.x.x
```

---

## Setup (first time only)

### 1. Clone the repository

```sh
git clone https://github.com/ncngmodelrailroad/ncngmodelrailroad.org.git
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
| [astro-icon](https://github.com/natemoo-re/astro-icon) | Icon component using [Iconify Solar](https://icon-sets.iconify.design/solar/) set |
| GitHub Pages | Free static hosting, auto-deploys on push |

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
- Fonts: Archivo Black (headings), Montserrat (body)
- Button classes: `.btn-primary`, `.btn-outline`
- See **[`docs/design-system.md`](design-system.md)** for the full token and component reference, and the live **`/styleguide`** page (noindex) which renders every token and component.

**Images** (`public/images/`) — Static files served as-is. No processing by Astro. Keep images optimized (800px wide, <200KB for gallery).

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