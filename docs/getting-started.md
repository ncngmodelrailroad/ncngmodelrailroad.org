# Getting Started

Welcome! This guide is for **anyone** — board members, volunteers, or curious visitors — who wants to understand how the N.C.N.G. website works. No technical experience needed.

---

## What is this?

This is the source code for the N.C.N.G. Historical Model Railroad website. The website is a collection of pages (Home, About, Gallery, Events, etc.) that live on the internet at:

**[ncngmodelrailroad.org](https://ncngmodelrailroad.org/)**

Think of this repository (repo) like a folder on a shared computer. It contains all the text, images, and code that make up the website. After a proposed change is checked and merged into `main`, GitHub rebuilds and publishes the site.

---

## How the site is organized

The website has these main pages:

| Page | What it shows |
| :--- | :------------ |
| **Home** | The next two upcoming events, layout photos, local history, and location details |
| **About** | Our history, mission, timeline from 1876 to today |
| **Trains** | The real N.C.N.G. Railroad history and engine roster |
| **Gallery** | Photos by category, with optional confirmed layout-area labels |
| **Events** | Upcoming events first, followed by event-day details and past listings |
| **Historic Map** | The original railroad route compared with modern imagery, not visitor directions |
| **Learn** | Beginner guides and a glossary of model-railroad terms |
| **Board Members** | Current board of directors with photos and roles |
| **Support the Layout** | Ways to support the organization (donate, volunteer, materials) |
| **Volunteer** | Roles, participation information, and an email link for new volunteers |
| **Contact** | How to reach us by email, phone, or Facebook, plus our location info |
| **Links** | Useful external resources about narrow gauge railroads |

---

## How to request a change

You don't need to know how to code to get something changed on the site. Here's what to do:

### Option 1: Propose an edit on GitHub

Follow the [step-by-step editing guide](../CONTRIBUTING.md#editing-content-no-coding-required).
You edit in your browser and submit a pull request so the webmaster can review
and publish the change.

> **Need access?** See [Getting Access](../CONTRIBUTING.md#getting-access) to request collaborator access.

Site admins can use [Pages CMS](https://app.pagescms.org/ncngmodelrailroad/ncngmodelrailroad.org)
for form-based editing. It defaults to saving to protected `main`; other
volunteers should use the GitHub steps above.

### Option 2: Email the webmaster
Use the [Contact page](https://ncngmodelrailroad.org/contact/) to email what you'd like changed. Be specific:
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
Propose a change -> Checks pass -> Webmaster merges it -> GitHub builds and publishes
```

Submitting a pull request does not publish it. Deployment starts after the change
reaches `main`; the live site updates when deployment succeeds.

---

## Frequently Asked Questions

**Q: Can I break the site by accident?**
A: Not easily. GitHub keeps a full history of every change. Anything can be undone.

**Q: Who can make changes?**
A: Collaborators can propose edits. The webmaster reviews and merges them. See the [Contributing Guide](../CONTRIBUTING.md#getting-access) for how to request access.

**Q: How do I get access?**
A: Follow [Getting access](../CONTRIBUTING.md#getting-access). Include your GitHub username and what you'd like to help with.

**Q: Is the site free to host?**
A: Yes. GitHub Pages hosting is free for public repositories.

**Q: Where are the photos stored?**
A: In the `public/images/` folder in this repository. They're served directly — no separate image hosting service.

---

## Next steps

Ready to make changes yourself? Move on to:
- [Contributing](../CONTRIBUTING.md#editing-content-no-coding-required) - Propose an edit in your browser
- [Editing Content](editing-content.md) — How to update events, board members, and photos by editing files
- [Development Guide](development.md) — How to run the site on your own computer
- [Support](../SUPPORT.md) — Where to get help
