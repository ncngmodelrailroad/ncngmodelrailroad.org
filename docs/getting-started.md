# Getting Started

Welcome! This guide is for **anyone** — board members, volunteers, or curious visitors — who wants to understand how the N.C.N.G. website works. No technical experience needed.

---

## What is this?

This is the source code for the N.C.N.G. Historical Model Railroad website. The website is a collection of pages (Home, About, Gallery, Events, etc.) that live on the internet at:

**[ncngmodelrailroad.org](https://ncngmodelrailroad.org/)**

Think of this repository (repo) like a folder on a shared computer. It contains all the text, images, and code that make up the website. When someone makes a change here and saves it, the website automatically updates.

---

## How the site is organized

The website has these main pages:

| Page | What it shows |
| :--- | :------------ |
| **Home** | Welcome message, hero photo, quick links to everything |
| **About** | Our history, mission, timeline from 1876 to today |
| **Trains** | The real N.C.N.G. Railroad history and engine roster |
| **Gallery** | Photos of the layout, historic images, and building |
| **Events** | Upcoming open houses and fairground events |
| **Learn** | Beginner guides and a glossary of model-railroad terms |
| **Board Members** | Current board of directors with photos and roles |
| **Get Involved** | Ways to support the organization (donate, volunteer, materials) |
| **Volunteer** | Sign-up form for new volunteers |
| **Contact** | Email contact form and our location info |
| **Links** | Useful external resources about narrow gauge railroads |

---

## How to request a change

You don't need to know how to code to get something changed on the site. Here's what to do:

### Option 1: Edit it yourself with Pages CMS (easiest)

[Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org) is a simple web editor that lets you update events, board members, gallery photos, and engine roster — no coding needed. Just log in with your GitHub account.

> **Need access?** See [Getting Access](../CONTRIBUTING.md#getting-access) to request collaborator access.

### Option 2: Email the webmaster
Send an email to **info@ncngmodelrailroad.org** with what you'd like changed. Be specific:
- "Please update a board member's role to Member at Large"
- "Can we add photos from the June open house?"
- "The Christmas Fair date should be November 27-29"

### Option 3: Open a GitHub Issue
If you have a GitHub account, you can open an issue directly:
1. Go to the repository on GitHub
2. Click the **Issues** tab
3. Click **New Issue**
4. Describe what needs to change
5. Someone with access will make the update

---

## How changes get to the live site

Here's the simple version of how it works:

```
Someone edits a file  →  Saves it to GitHub  →  Site auto-rebuilds  →  Live in ~2 minutes
```

That's it. There's no separate "publish" step. Push to `main` and it goes live.

---

## Frequently Asked Questions

**Q: Can I break the site by accident?**
A: Not easily. GitHub keeps a full history of every change. Anything can be undone.

**Q: Who can make changes?**
A: Anyone with collaborator access to the GitHub repository. See the [Contributing Guide](../CONTRIBUTING.md#getting-access) for how to request access.

**Q: How do I get access?**
A: Email info@ncngmodelrailroad.org to be added as a collaborator.

**Q: Is the site free to host?**
A: Yes. GitHub Pages hosting is free for public repositories.

**Q: Where are the photos stored?**
A: In the `public/images/` folder in this repository. They're served directly — no separate image hosting service.

---

## Next steps

Ready to make changes yourself? Move on to:
- [Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org) — The quickest way to update content (no coding needed)
- [Editing Content](editing-content.md) — How to update events, board members, and photos by editing files
- [Development Guide](development.md) — How to run the site on your own computer
- [Support](../SUPPORT.md) — Where to get help
