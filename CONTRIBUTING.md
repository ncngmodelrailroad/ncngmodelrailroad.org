# Contributing to the N.C.N.G. Website

Thanks for helping improve the N.C.N.G. Historical Model Railroad website! This guide covers how to get access and submit changes.

---

## Getting Access

To edit content on the website, you need **collaborator access** to the GitHub repository. Here's how to get it:

1. Create a free [GitHub account](https://github.com/signup) if you don't have one
2. Ask the webmaster or websitesite admin to add you as a collaborator
3. Accept the invitation you receive from GitHub (check your email)
4. You're all set — you can now use [Pages CMS](https://app.pagescms.org/djdefi/ncngmodelrailroad.org) or edit files directly on GitHub

---

## Editing content (no coding required)

If you need to update events, board members, gallery photos, or train information, you don't need to know how to code. There are two ways to make content changes:

### Option 1: Pages CMS (recommended)

The website uses [Pages CMS](https://pagescms.org), a free content editor built for GitHub.

1. Go to [app.pagescms.org/djdefi/ncngmodelrailroad.org](https://app.pagescms.org/djdefi/ncngmodelrailroad.org)
2. Click **Login with GitHub**
3. Choose what to edit: Events, Board Members, Photo Gallery, or Historical Locomotive Roster
4. Make your changes using the simple form fields
5. Click **Save** — the website updates automatically in about 2 minutes

### Option 2: Edit files on GitHub

You can also edit content files directly on GitHub:

1. Go to [github.com/djdefi/ncngmodelrailroad.org](https://github.com/djdefi/ncngmodelrailroad.org)
2. Navigate to the content folder for what you want to edit:
   - **Events:** `src/content/events/`
   - **Board members:** `src/content/board/`
   - **Gallery photos:** `src/content/gallery/`
   - **Engine roster:** `src/content/trains/`
3. Click on a file, then click the **pencil icon** to edit
4. Update the fields between the `---` markers at the top of the file
5. Click **Commit changes** — the website updates automatically

### Can't find what you need?

[Open an issue](https://github.com/djdefi/ncngmodelrailroad.org/issues/new/choose) describing what you'd like changed and someone will help.

### Public visiting information

The layout opens during selected Nevada County Fairgrounds events, only when an
opening is announced on this website. A host event does not establish layout
opening dates or hours. Work sessions are for volunteers, not public visits.
Do not advertise drop-in visits or private tours. Confirm event details before
publishing, list layout hours separately from host-event hours, and use TBA when
layout hours are unknown. Keep host dates in `date` / `endDate`; use optional
`layoutStartDate` / `layoutEndDate` only for confirmed layout opening days.
See [Updating Events](docs/editing-content.md#updating-events).

### Gallery areas and historical roster

Gallery entries have an optional **Layout Area** field in Pages CMS (`area` in
Markdown). Keep the existing category and add an area only when it is identified.
Use consistent area names; leave unknown or unrelated photographs unassigned.
Area filtering appears automatically when at least one photo has an area.
See [Layout areas](docs/editing-content.md#layout-areas).

The `trains` collection describes the original railroad's historical locomotives.
It is not an inventory of the models and rolling stock currently on the layout.
Keep future, verified model-inventory information separate from that roster.

### Machine-readable content

The site publishes a [JSON data catalog](https://ncngmodelrailroad.org/data/catalog.json) linked from `/llms.txt`. Event and train feeds rebuild from their content collections; the glossary feed rebuilds from `src/data/glossary.yaml`. Edit those sources, not generated files in `dist/`. Historical map downloads use the existing GeoJSON files without copying them. Keep feed field descriptions and caveats in `src/config/data.ts` aligned with source changes. See [Machine-readable data](docs/development.md#machine-readable-data) for the format and scope.

Nonprofit identity and donation instructions come from `src/config/organization.ts`
and appear on the donation page, in `/llms.txt`, and in the catalog. Keep the IRS
source date tied to the supporting records, not the build date. Update the shared
donation method and instructions when an approved payment route changes; do not
publish private paperwork or an unconfirmed checkout link.

---

## Larger changes (branch + pull request)

For bigger changes (new pages, design updates, multiple files), use a branch:

### 1. Create a branch

```sh
git checkout -b my-change-description
```

### 2. Make your changes

Edit files, add images, etc. Test locally with `npm run dev`.

### 3. Commit

```sh
git add -A
git commit -m "Short description of what changed"
```

Write clear commit messages. Examples:
- `Add 2027 event dates`
- `Update board member photos`
- `Fix broken link on contact page`

### 4. Push and open a pull request

```sh
git push origin my-change-description
```

Then go to GitHub and open a **Pull Request**. Describe what you changed and why. The webmaster will review and merge it.

---

## Code conventions

- **Icons**: Use [Iconify Solar](https://icon-sets.iconify.design/solar/) bold variants via `astro-icon`. No emoji in page content. Solar carries no brand logos, so third-party marks (for example `simple-icons:facebook`) come from [Simple Icons](https://icon-sets.iconify.design/simple-icons/). Use Simple Icons only for brand marks.
- **Images**: JPEG format, max 800px wide for gallery, keep under 200KB. Use `loading="lazy"` and `decoding="async"` on all images.
- **Links**: Always use `` `${base}/path` `` for internal links. External links get `target="_blank" rel="noopener noreferrer"`.
- **Styling**: Use Tailwind utility classes. Site colors are defined as CSS variables in `global.css`.
- **Config**: Org info goes in `src/config/organization.ts`, not hardcoded in pages.

---

## Questions?

- **Edit content:** Use [Pages CMS](https://app.pagescms.org/djdefi/ncngmodelrailroad.org) or [open an issue](https://github.com/djdefi/ncngmodelrailroad.org/issues)
- **Email:** info@ncngmodelrailroad.org
