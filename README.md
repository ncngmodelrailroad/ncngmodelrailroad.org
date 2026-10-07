# N.C.N.G. Historical Model Railroad

[![Deploy to GitHub Pages](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/actions/workflows/deploy.yml)

The official website for the **Nevada County Narrow Gauge Historical Model Railroad**, an all-volunteer organization preserving the legacy of the N.C.N.G. Railroad (1876–1942) through a detailed On3 scale model railroad display at the Nevada County Fairgrounds in Grass Valley, California.

**[Visit the website](https://ncngmodelrailroad.org/)** · [Upcoming openings](https://ncngmodelrailroad.org/events/) · [Volunteer](https://ncngmodelrailroad.org/volunteer/) · [Support the layout](https://ncngmodelrailroad.org/donate/)

This repository holds our public website. For visits, volunteering at the layout,
or contributions of money or equipment, use the website links above. For website
corrections and technical contributions, start below.

---

## Want to update the website?

**You don't need to know how to code.** [Request a content update](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/issues/new?template=content-update.yml)
or follow the [GitHub editing guide](CONTRIBUTING.md#editing-content-no-coding-required)
to propose a change through a pull request.

[Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org)
provides form-based editing for site admins. It defaults to saving to protected
`main`; other volunteers should use the pull-request workflow.

> **First time?** You'll need collaborator access to the repository. See the [Contributing Guide](CONTRIBUTING.md#getting-access) to request it.

---

## Quick Start (developers)

```sh
npm ci             # install the locked dependencies
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
│   ├── contact.astro     # Contact details and location
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
| [GitHub Organization](docs/github-organization.md) | Org owners maintaining the public profile and nonprofit enrollment |
| [Support](SUPPORT.md) | Quick reference for getting help |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community standards for contributors |

## Tech Stack

- **[Astro](https://astro.build/)** — Static site generator (zero JS shipped by default)
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Iconify Solar](https://icon-sets.iconify.design/solar/)** — Icon set via `astro-icon`, with [Simple Icons](https://icon-sets.iconify.design/simple-icons/) for brand marks
- **Deployed to** GitHub Pages (auto-deploys on push to `main`)

## License

Content and images are property of the N.C.N.G. Historical Model Railroad organization.
