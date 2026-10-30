# N.C.N.G. Historical Model Railroad — Website

[![Deploy to GitHub Pages](https://github.com/djdefi/ncngmodelrailroad.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/djdefi/ncngmodelrailroad.org/actions/workflows/deploy.yml)

The official website for the **Nevada County Narrow Gauge Historical Model Railroad**, an all-volunteer organization preserving the legacy of the N.C.N.G. Railroad (1876–1942) through a detailed On3 scale model railroad display at the Nevada County Fairgrounds in Grass Valley, California.

**Live site:** [ncngmodelrailroad.org](https://ncngmodelrailroad.org/)

---

## Want to update the website?

**You don't need to know how to code.** Use
[Pages CMS on a content branch](docs/editing-content.md#propose-changes-with-pages-cms)
for events, board members, gallery photos, and the historical engine roster.
Save your proposal, then open a GitHub pull request for checks and review.
The live site changes only after the pull request is merged.

> **First time?** You'll need collaborator access to the repository. See the [Contributing Guide](CONTRIBUTING.md#getting-access) to request it.

---

## Quick Start (developers)

Use Node.js 22.23.4 and install the locked dependencies with `npm ci`.

```sh
npm ci             # install the versions recorded in package-lock.json
npm run dev        # start local dev server at localhost:4321
npm run build      # build for production into dist/
```

## Project Structure

```
src/
├── config/           # Organization, navigation, content-use policy, and data metadata
├── content/          # Markdown collections: events, board, gallery, trains, learn
├── data/glossary.yaml
├── layouts/          # Shared page layout, SEO, and structured data
├── components/       # Reusable Astro UI
├── pages/            # Site routes, including /map/, JSON feeds, and /llms.txt
├── styles/global.css # Tailwind v4 theme and global styles
└── utils/            # Shared event, data-feed, and image helpers
public/
├── images/           # Site and gallery images
├── map/              # Standalone maps, map data, and vendor assets
└── downloads/        # Public downloads
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
- **[Iconify Solar](https://icon-sets.iconify.design/solar/)** — Icon set via `astro-icon`, with [Simple Icons](https://icon-sets.iconify.design/simple-icons/) for brand marks
- **Deployed to** GitHub Pages (auto-deploys on push to `main`)

## License

Content and images are property of the N.C.N.G. Historical Model Railroad organization.
