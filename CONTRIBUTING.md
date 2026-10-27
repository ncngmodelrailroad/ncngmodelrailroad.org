# Contributing to the N.C.N.G. Website

Thanks for helping improve the N.C.N.G. Historical Model Railroad website! This guide covers how to get access and submit changes.

---

## Getting access

To edit the website, you need **collaborator access** to this repository.

1. Create a free GitHub account at [github.com/signup](https://github.com/signup). See [Creating an account on GitHub](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github).
2. Turn on two-factor authentication and save your recovery codes somewhere safe. See [Configuring two-factor authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication).
3. On the website's [Contact page](https://ncngmodelrailroad.org/contact/), click **Write an email**. Say what you'd like to help with and include your GitHub username.
4. When the webmaster or board adds you, GitHub emails you an invitation. Open it and click **Accept invitation** (or **Join**). Invitations expire after 7 days, so ask for a new one if yours runs out.

If GitHub asks you to **fork** the repository when you try to edit, your access isn't ready yet. Stop and contact the webmaster.

---

## Editing content (no coding required)

Changes to `main` go through a **pull request**: you propose a change, automatic checks test it, and the webmaster reviews and publishes it.

### Edit a file on GitHub

1. Sign in and open [github.com/ncngmodelrailroad/ncngmodelrailroad.org](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org).
2. Open the folder for what you want to change. The content covered by this guide lives in `src/content/`:
   - **Events:** `src/content/events/` (one file per event, named by date)
   - **Board members:** `src/content/board/`
   - **Gallery photos:** `src/content/gallery/`
   - **Engine roster:** `src/content/trains/`
   - **Beginner guides:** `src/content/learn/`
3. Click the file, then click the **pencil icon** near the top right.
4. Change only the text you need. In the details block between the `---` lines, keep the field names (such as `title` and `date`) as they are. Dates use the format `2026-11-27`. The **Preview** tab helps you check wording.
5. Click **Commit changes...**, write a short message that says what changed, choose **Create a new branch for this commit and start a pull request**, and click **Propose changes**.
6. On the next page, click **Create pull request**. Say what changed and where the information came from. Don't include private phone numbers, email addresses, or other personal details.
7. Wait for the automatic checks. A green check means they passed. A red X means something needs fixing; the webmaster can help.
8. The webmaster reviews and merges your pull request. If they ask for changes, open the **Files changed** tab of your pull request, click the **...** menu on the file, and choose **Edit file**. Commit to the same branch and the pull request updates automatically. The site updates within a few minutes of merging.

GitHub Docs: [Editing files](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files) and [Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

### Photos and anything else

To add or replace a photo, or if you're not sure how to make a change, [open a Content update request](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/issues/new?template=content-update.yml) or email the webmaster from the [Contact page](https://ncngmodelrailroad.org/contact/).

### Pages CMS (site admins)

[Pages CMS](https://pagescms.org) offers form-based editing for events, board members, gallery photos, and the engine roster at [app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org). It saves to the branch selected in its branch menu, which is `main` by default. Only site admins can save to the protected `main` branch, so other volunteers should use the GitHub steps above.

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
publish private paperwork or an unconfirmed checkout link. The SPD Market eScrip
Group ID, rate, and signup link live in `organization.escrip`; update them there
if the eScrip enrollment changes.

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

- **Edit content:** Follow [Editing content](#editing-content-no-coding-required) or [open an issue](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/issues/new/choose)
- **Email:** use the website's [Contact page](https://ncngmodelrailroad.org/contact/)
