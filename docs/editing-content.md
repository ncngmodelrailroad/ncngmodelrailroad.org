# Editing Content

This guide covers the most common updates: events, board members, gallery photos, and organization info.

---

## Easiest option: Use Pages CMS

For most content updates, you don't need to edit files directly. **[Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org)** provides a simple web editor with form fields for each content type.

1. Go to [app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org)
2. Log in with your GitHub account
3. Select what you want to edit (Events, Board Members, Gallery, or Engine Roster)
4. Fill in the fields and click **Save**
5. The site updates automatically in about 2 minutes

> **Need access?** See [Getting Access](../CONTRIBUTING.md#getting-access) to request collaborator access.

The rest of this guide covers editing files directly — useful if you prefer working with code or need to make changes that Pages CMS doesn't support.

---

## Table of Contents

- [Updating Events](#updating-events)
- [Updating Board Members](#updating-board-members)
- [Adding Gallery Photos](#adding-gallery-photos)
- [Updating the Learn Section](#updating-the-learn-section)
- [Updating Organization Info](#updating-organization-info)
- [Updating Navigation](#updating-navigation)

---

## Updating Events

Events are Markdown files in `src/content/events/`. Each file = one event on the Events page.

### File location
```
src/content/events/
├── 2026-06-18-fathers-day-bluegrass.md
├── 2026-08-13-nevada-county-fair.md
├── 2026-09-18-draft-horse-classic.md
└── 2026-11-27-christmas-fair.md
```

### Adding a new event

Create a new `.md` file in `src/content/events/`. Name it with the date and a short slug:

```
2027-06-18-fathers-day-bluegrass.md
```

Contents:

```markdown
---
title: "Father's Day Bluegrass Festival"
date: 2027-06-18
endDate: 2027-06-21
location: "Nevada County Fairgrounds, Grass Valley"
featured: true
---

Join us during the Father's Day Bluegrass Festival! Our layout will be open
for visitors throughout the weekend. Check the festival for admission details.
```

**Field reference:**

| Field | Required | Description |
| :---- | :------- | :---------- |
| `title` | Yes | Event name (in quotes) |
| `date` | Yes | Start date as `YYYY-MM-DD` |
| `endDate` | No | End date for multi-day events |
| `location` | Yes | Where the event takes place |
| `featured` | No | Set to `true` to highlight on the Events page |

The body text (below the `---`) is the event description shown on the page.

### Editing an existing event

Open the file and change the fields you need. The most common update is changing dates for the new year.

### Removing an event

Delete the file. The event disappears from the site automatically.

> **Note:** The Events page automatically hides past events. You don't need to delete old events — they just won't show up after their date passes.

---

## Updating Board Members

Board members are Markdown files in `src/content/board/`, one file per person. The easiest way to edit them is [Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org) → **Board Members**, but you can also edit the files directly.

### File location

```
src/content/board/
├── jane-doe.md
├── john-smith.md
└── ...
```

### Editing a member

Open their file and change the fields in the frontmatter (between the `---` lines):

```md
---
name: Jane Doe
role: President
bio: Leads the organization and oversees operations.
image: board/jane-doe.jpeg
order: 1
---
```

**Field reference:**

| Field | Required | Description |
| :---- | :------- | :---------- |
| `name` | Yes | Full name |
| `role` | Yes | Role or title |
| `bio` | Yes | Short description |
| `image` | Yes | Photo path under `public/images/` (for example `board/jane-doe.jpeg`) |
| `order` | Yes | Display position (lower numbers appear first) |

### Adding a member

1. **Add their photo** to `public/images/board/` (JPEG, displays at 96×96px).
2. **Create a new file** in `src/content/board/`, for example `jane-doe.md`, with the fields above. Set `order` to control where they appear.

### Removing a member

Delete their file from `src/content/board/`.

---

## Adding Gallery Photos

The gallery is managed with one Markdown file per photo in `src/content/gallery/`.

### Step 1: Add the image file

Copy the photo to `public/images/`. Use a descriptive filename:

```
public/images/gallery-open-house-2026.jpg
```

**Image guidelines:**
- JPEG format preferred (smaller file size)
- Resize to **800px wide** max before adding (keeps the site fast)
- Keep file size under **200KB** if possible

### Step 2: Add a gallery entry

Create a new Markdown file in `src/content/gallery/`, for example:

```md
src/content/gallery/gallery-open-house-2026.md
```

Add frontmatter like this:

```md
---
title: "Visitors viewing the layout during the 2026 open house"
image: gallery-open-house-2026.jpg
caption: "Visitors at our 2026 Summer Open House"
category: Fairgrounds & Events
---
```

**Field reference:**

| Field | Description |
| :---- | :---------- |
| `title` | Used for the image alt text and lightbox title context |
| `image` | Filename in `public/images/` |
| `caption` | Short text shown below the photo in the lightbox |
| `category` | One of: `Historic`, `Layout`, `Volunteer Work`, `Fairgrounds & Events` |

### Categories

Photos are filterable by category on the gallery page:

- **Historic** — Original N.C.N.G. Railroad photos and archival views
- **Layout** — Model railroad scenes, trains, structures, and scenery details
- **Volunteer Work** — Members building, maintaining, or improving the layout
- **Fairgrounds & Events** — Building exterior, exhibit context, open houses, and fairgrounds scenes

---

## Updating the Learn Section

The [Learn](https://ncngmodelrailroad.org/learn) section has two parts: a glossary of terms and beginner guides.

### Glossary terms

Glossary terms live in one file: `src/data/glossary.yaml`. To add a term, copy an existing block and change the words:

```yaml
- id: ballast
  term: "Ballast"
  definition: "The crushed rock packed around and between the ties to hold the track in place."
  category: Track & Operating
```

- `id` is a short label, lowercase with hyphens (also used as the link anchor)
- `category` is one of: `Scale & Gauge`, `Trains & Equipment`, `Building & Detailing`, `Track & Operating`

### Learn guides

Longer guides are Markdown files in `src/content/learn/`. Add a new `.md` file with frontmatter like this:

```md
---
title: New to Model Railroading?
description: A short summary shown on the Learn hub.
order: 1
icon: solar:book-bold
---

Your guide text goes here.
```

> **Note:** The Learn section is not in Pages CMS, so edit these as files (on GitHub or locally).

---

## Updating Organization Info

Centralized info (name, address, phone, email) lives in one file:

```
src/config/organization.ts
```

Changes here automatically update the footer, contact page, structured data, and anywhere else org info appears. For example, to update the phone number:

```typescript
contact: {
  phone: '(916) 871-6341',  // ← change this
  email: 'ncngrr@hotmail.com',
},
```

### Analytics

The site supports cookie-free analytics via Cloudflare Web Analytics (no consent banner needed). To enable it:

1. Go to [Cloudflare Web Analytics](https://dash.cloudflare.com/) → **Web Analytics** → **Add site**
2. Enter `ncngmodelrailroad.org` and copy the **beacon token**
3. Paste it in `organization.ts`:

```typescript
analytics: {
  cfBeaconToken: "your-token-here",  // ← paste token
},
```

Once set, analytics data appears in your Cloudflare dashboard — page views, referrers, countries, and devices.

---

## Updating Navigation

The site navigation (header links on every page) is defined in:

```
src/config/navigation.ts
```

To add, remove, or reorder pages in the nav, edit the `navItems` array:

```typescript
export const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events', icon: 'solar:calendar-bold' },
  { label: 'Get Involved', href: '/donate', cta: true },
  // ... add or remove items here
];
```

---

## After making changes

Once you save your changes (commit and push to `main`), the site will automatically rebuild and deploy within about 2 minutes. No extra steps needed.

If you're unsure about a change, ask the webmaster to review it first — GitHub pull requests are great for this.

---

## Next steps

- [Development Guide](development.md) — Run the site locally on your computer to preview changes before publishing
