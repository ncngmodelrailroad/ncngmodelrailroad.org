# Contributing to the N.C.N.G. Website

Thanks for helping improve the N.C.N.G. Historical Model Railroad website! This guide covers how to get access and submit changes.

---

## Getting Access

To edit content on the website, you need **collaborator access** to the GitHub repository. Here's how to get it:

1. Create a free [GitHub account](https://github.com/signup) if you don't have one
2. Ask the webmaster or websitesite admin to add you as a collaborator
3. Accept the invitation you receive from GitHub (check your email)
4. You're all set — you can now use [Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org) or edit files directly on GitHub

---

## Editing content (no coding required)

If you need to update events, board members, gallery photos, or train information, you don't need to know how to code. There are two ways to make content changes:

### Option 1: Pages CMS (recommended)

The website uses [Pages CMS](https://pagescms.org), a free content editor built for GitHub.

1. Go to [app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org)
2. Click **Login with GitHub**
3. Choose what to edit — Events, Board Members, Photo Gallery, or Engine Roster
4. Make your changes using the simple form fields
5. Click **Save** — the website updates automatically in about 2 minutes

### Option 2: Edit files on GitHub

You can also edit content files directly on GitHub:

1. Go to [github.com/ncngmodelrailroad/ncngmodelrailroad.org](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org)
2. Navigate to the content folder for what you want to edit:
   - **Events:** `src/content/events/`
   - **Board members:** `src/content/board/`
   - **Gallery photos:** `src/content/gallery/`
   - **Engine roster:** `src/content/trains/`
3. Click on a file, then click the **pencil icon** to edit
4. Update the fields between the `---` markers at the top of the file
5. Click **Commit changes** — the website updates automatically

### Can't find what you need?

[Open an issue](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/issues/new/choose) describing what you'd like changed and someone will help.

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

- **Icons**: Use [Iconify Solar](https://icon-sets.iconify.design/solar/) bold variants via `astro-icon`. No emoji in page content.
- **Images**: JPEG format, max 800px wide for gallery, keep under 200KB. Use `loading="lazy"` and `decoding="async"` on all images.
- **Links**: Always use `` `${base}/path` `` for internal links. External links get `target="_blank" rel="noopener noreferrer"`.
- **Styling**: Use Tailwind utility classes. Site colors are defined as CSS variables in `global.css`.
- **Config**: Org info goes in `src/config/organization.ts`, not hardcoded in pages.

---

## Questions?

- **Edit content:** Use [Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org) or [open an issue](https://github.com/ncngmodelrailroad/ncngmodelrailroad.org/issues)
- **Email:** info@ncngmodelrailroad.org
