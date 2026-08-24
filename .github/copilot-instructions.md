# Copilot instructions

Public website for an all-volunteer model railroad museum. Astro static site, Tailwind v4, deployed to GitHub Pages at a root custom domain.

## This is a PUBLIC repository

- Never name or call out individuals, or include private information (voicemails, personal characterizations, "can't use X"), in commits, PR titles/descriptions, docs, code, or comments.
- The only place real names belong is the public board roster (`src/content/board/`, shown on the Board Members page). In docs examples, design notes, and anything else, use generic roles or placeholders.

## Build and dev loop

- `npm run dev` — local dev server at http://localhost:4321
- `npm run build` — production build into `dist/`; this is exactly what CI runs
- `npm run preview` — serve the production build
- There is no unit-test suite. "Validating a change" means it builds, and for visual changes that it renders correctly (see Visual / CSS changes).

## Deploy and branch protection

- `main` is protected: changes need a pull request and a passing **Build check** (`.github/workflows/build-check.yml`, runs `npm ci` + `npm run build` on PRs). This project is maintained by one person, so no review approval is required and the author can merge their own PR. Force pushes and branch deletion stay blocked.
- Deployment (`.github/workflows/deploy.yml`) runs only on push to `main`. Both workflows pin actions to commit SHAs; Dependabot keeps them current.
- An **Accessibility check** (`.github/workflows/a11y.yml`) runs an axe-core WCAG 2.1 AA audit over every page on PRs (`npm run a11y`). It is not a required status check, so it cannot block a merge on its own. Treat a failure like a failing build anyway.

## Merge gate

Merge a PR only after all of the following: CI and tests pass, and the change has been **rubber-ducked**, **code-reviewed**, and **de-slopped** (an anti-slop pass on any prose, per the stop-slop guidelines: no em dashes, no filler, active voice, specific). Do not merge on green CI alone.


## Architecture

- **Pages** are `src/pages/*.astro`, one file per route. `base` is `/` (custom domain), so internal links and image paths are root-relative.
- **Content collections** (`src/content.config.ts`): `events`, `board`, `gallery`, `trains` (engine roster), and `learn` (newcomer guides) are Markdown via the `glob` loader. The glossary is a single YAML file, `src/data/glossary.yaml`, loaded via the `file()` loader — add terms there, not in component code.
- **Shared config** in `src/config/`: `organization.ts` (name, address, contact, analytics) and `navigation.ts` (nav items; the call-to-action item uses a `cta: true` flag).
- **Layout** `src/layouts/BaseLayout.astro` holds the header, footer (with a dynamic upcoming-events list), SEO meta, and schema.org JSON-LD.
- **Styling** is Tailwind v4 plus a custom theme in `src/styles/global.css` (CSS variables and `@theme`). Brand colors and fonts live in `@theme`; extended semantic tokens live in `:root`. See `docs/design-system.md` and the live `/styleguide` page for the full token and component reference.
- **Analytics** is Cloudflare Web Analytics only (cookie-free, no consent banner) via `organization.analytics.cfBeaconToken`. Do not add a second analytics provider.

## Content editing

- Most content (events, board, gallery, trains) is editable through Pages CMS (`.pages.yml`), but it requires a GitHub login and commits to `main`, so non-admin editors hit branch protection. The `learn` collection and `glossary.yaml` are not wired into the CMS — edit them as files.
- Keep `docs/` and `CONTRIBUTING.md` in sync when collections, fields, or the palette change.

## Events and content accuracy

- Do not assert an admission price or "free" for visiting the layout — no "free", and no JSON-LD `Offer` / `priceRange`. The host festival may be ticketed, but the layout's admission varies and is often unconfirmed.
- The layout's open hours can differ from the host event's dates. Mark hours TBA unless confirmed.
- Club information is sporadic and unreliable. Do not publish event changes (add, cancel, or hours) off a single unverified report. Confirm first, default to conservative wording, and prefer reversible PRs over direct commits.

## Dependencies

- After changing dependencies, regenerate the lockfile for Linux: `npm install --package-lock-only --os=linux --cpu=x64`. A macOS-only lock omits Linux native binaries (rollup, esbuild, sharp, lightningcss) and breaks `npm ci` on the Pages CI runner.
- Transitive or security bumps that a parent's range won't allow go through `package.json` `overrides`.

## Visual / CSS changes

- Verify visual changes by building and screenshotting the result, including dark mode (`prefers-color-scheme: dark`).
- Use `playwright-cli` (npm `@playwright/cli`, https://github.com/microsoft/playwright-cli) for browser checks and screenshots. It runs Playwright's agent commands (open/click/snapshot/screenshot, ARIA `ref`s) from the terminal and writes snapshots, screenshots, and console/network logs to `.playwright-cli/` (gitignored). Prefer it over a Playwright MCP server.
- `global.css` overrides `.bg-white` and `header.bg-white` to dark surfaces in dark mode, so the header is not always white. Do not assume a fixed background when reasoning about contrast — check the actual rendered colors.

## Conventions

- Icons: Iconify Solar bold variants via `astro-icon`. One icon set, no emoji in page content.
- Images: JPEG, about 800px wide and under 200KB for gallery; `loading="lazy"` and `decoding="async"`, except hero/LCP images which stay `loading="eager"` with `fetchpriority="high"`.
- Organization info comes from `src/config/organization.ts`, never hardcoded in pages.
