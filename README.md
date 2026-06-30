# N.C.N.G. Historical Model Railroad — Website

[![Deploy to GitHub Pages](https://github.com/djdefi/ncngmodelrailroad.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/djdefi/ncngmodelrailroad.org/actions/workflows/deploy.yml)

The official website for the **Nevada County Narrow Gauge Historical Model Railroad**, an all-volunteer organization preserving the legacy of the N.C.N.G. Railroad (1876–1942) through a detailed On3 scale model railroad display at the Nevada County Fairgrounds in Grass Valley, California.

**Live site:** [ncngmodelrailroad.org](https://ncngmodelrailroad.org/)

---

## Want to update the website?

**You don't need to know how to code.** The easiest way to edit content is through [Pages CMS](https://app.pagescms.org/djdefi/ncngmodelrailroad.org) — a simple web editor for events, board members, gallery photos, and more. Just log in with your GitHub account.

> **First time?** You'll need collaborator access to the repository. See the [Contributing Guide](CONTRIBUTING.md#getting-access) to request it.

---

## Quick Start (developers)

```sh
npm install        # install dependencies (first time only)
npm run dev        # start local dev server at localhost:4321
npm run build      # build for production
```

## Project Structure

```
src/
├── config/           # Centralized org data & navigation
│   ├── organization.ts   # Name, address, contact info
│   └── navigation.ts     # Shared nav items for header/mobile
├── content/          # Markdown content collections
│   ├── events/       # Event pages (one Markdown file per event)
│   ├── board/        # Board members
│   ├── gallery/      # Gallery photos
│   ├── trains/       # Engine roster
│   └── learn/        # Learn / newcomer guides
├── data/
│   └── glossary.yaml # Glossary terms (Learn section)
├── layouts/
│   └── BaseLayout.astro  # Shared header, footer, SEO, schema.org
├── components/       # Reusable UI pieces (Button, SectionHeader, etc.)
├── pages/            # Each .astro file = one page on the site
│   ├── index.astro       # Homepage
│   ├── about.astro       # History & mission
│   ├── trains.astro      # Engine roster & railroad history
│   ├── gallery.astro     # Photo gallery with lightbox
│   ├── events.astro      # Upcoming events (auto-generated from content/)
│   ├── learn/            # Learn section: hub, glossary, guides
│   ├── board-members.astro # Board of directors
│   ├── donate.astro      # Get Involved (donate / support)
│   ├── volunteer.astro   # Volunteer signup
│   ├── contact.astro     # Contact form
│   ├── links.astro       # External resources
│   └── 404.astro         # Not found page
├── styles/
│   └── global.css    # Tailwind + custom theme (colors, buttons, etc.)
public/
├── images/           # All photos (gallery, board, heroes, etc.)
└── favicon.svg       # Site icon
```

## Documentation

New here? Start with the guide that matches your comfort level:

| Guide | Who it's for |
| :---- | :----------- |
| [Getting Started](docs/getting-started.md) | Board members & anyone who just wants to understand the site |
| [Editing Content](docs/editing-content.md) | Anyone who needs to update events, photos, or board info |
| [Development Guide](docs/development.md) | Developers who want to run the site locally and make changes |
| [Design System](docs/design-system.md) | Developers working on UI: tokens, components, and the `/styleguide` reference |
| [Contributing](CONTRIBUTING.md) | Anyone submitting changes via GitHub |
| [Support](SUPPORT.md) | Quick reference for getting help |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community standards for contributors |

## Tech Stack

- **[Astro](https://astro.build/)** — Static site generator (zero JS shipped by default)
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Iconify Solar](https://icon-sets.iconify.design/solar/)** — Icon set via `astro-icon`
- **Deployed to** GitHub Pages (auto-deploys on push to `main`)

## License

Content and images are property of the N.C.N.G. Historical Model Railroad organization.
