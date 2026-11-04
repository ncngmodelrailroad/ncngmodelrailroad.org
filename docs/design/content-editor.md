# Design: magic-link content editor for non-GitHub volunteers

**Status:** Proposal, not built. **Owner:** @djdefi. **Last updated:** 2026-06.

A design to capture for later. Nothing here is implemented yet.

---

## Problem

Some volunteers need to add and correct events, but they
cannot or will not create a GitHub account. Signup, passwords, and mandatory
2FA are each a wall, and so is a screen share. [Pages CMS](https://pagescms.org)
works well for editors who do have GitHub accounts, but it requires a GitHub
login, so it does not help them.

We want a way for a named person to edit one narrow slice of content from a
link, with no account, while every change stays reviewable.

## Goals

- A no-account editing path: a person opens a private link and edits scoped
  content (events first). No signup, no login, no 2FA.
- A management UI for authenticated admins to issue, scope, and revoke those
  links, and to review what comes in.
- Every change lands as a pull request a maintainer approves. This fits the
  branch protection already on `main`.
- GitHub-native and vendor-neutral. Reuse the Cloudflare account we already
  have for analytics. No new SaaS.

## Non-goals

- Replacing Pages CMS for editors who do have GitHub accounts.
- Real-time or multi-user concurrent editing.
- Building any of this before the update volume justifies it. The museum
  changes a few times a year, so this is a "when we want it" design, not a
  need.

## Components

- **Cloudflare Worker** — the API and the only place that holds secrets. It
  mints GitHub App tokens, validates capability links, and opens PRs.
- **GitHub App** — how the Worker writes to the repo. Short-lived,
  repo-scoped, least-privilege.
- **Cloudflare KV or D1** — stores issued links (scope, expiry, revocation),
  an audit log, and optionally draft submissions.
- **Admin UI** — a small page gated by GitHub OAuth. Issues and revokes
  links, reviews submissions.
- **Editor UI** — a simple form the capability link opens. Renders fields for
  the allowed content type. No account.

```
Admin (you) ──GitHub OAuth──▶ /admin UI
     │  "create an edit link for a volunteer · scope: events · expires 30d"
     ▼
Cloudflare Worker ──signs a scoped token──▶ KV/D1
     │                                       (who · scope · expiry · revoked? · audit)
     ▼
Volunteer gets https://…/edit#t=<signed-token>   (emailed to them)
     │  opens it → scoped editor form (no account, no login, no 2FA)
     ▼
Worker validates token ──GitHub App token──▶ branch + pull request
     ▼
Branch protection (build check + your approval) ──▶ merge ──▶ deploy
```

## Auth model

Three distinct identities, kept separate on purpose.

1. **GitHub App (Worker to repo).** The Worker holds the App private key as a
   Workers secret, mints a JWT (RS256, ~10 minute expiry), exchanges it for a
   1-hour installation token, and uses that for the GitHub REST API.
   Permissions: Contents read/write, Pull requests read/write, Issues
   read/write. Nothing else. The Worker can do the RS256 signing with the
   built-in Web Crypto API, so it needs no extra libraries.
2. **Admin (person to management UI).** GitHub OAuth. Authorize only repo
   collaborators with write/admin, or an explicit allowlist. Admins are the
   people who can mint links and approve PRs.
3. **Editor / magic link (volunteer to editor UI).** A signed capability token in
   the URL fragment. It encodes an id, the allowed scope (for example
   `events:write`), an expiry, and a nonce. The Worker signs it (HMAC-SHA256
   with a Workers secret, or a short JWT) and stores its id so it can be
   revoked and rate-limited. The link is the credential.

## Capability links

- **Scope: narrow.** "Edit events," or even "edit this one event." Never broad
  repo access.
- **Expiry: built in** (for example 30 days). Re-issue when needed.
- **Revocable.** Stored by id, so an admin can kill a link instantly.
- **Delivery.** Email the link to the person so only they receive it. Treat it
  like a password.
- **Optional hardening.** Single-use for one-off corrections, or bind the link
  to an email the person confirms.

## Data model (KV or D1)

- `capabilities`: id, label (who it is for), scope, created_at, expires_at,
  revoked, use_count, last_used_at.
- `audit_log`: timestamp, capability_id or admin, action, target (file or PR),
  result.
- `submissions` (optional): draft content saved before submit.

Start with KV for simplicity. Move to D1 if you want real queries and a clean
audit table.

## Submission flow

1. The volunteer opens their link. The Worker validates the token (signature, expiry,
   revocation) and returns the editor UI plus the current content for their
   scope.
2. He edits and submits. The Worker validates again, then uses the GitHub App
   token to:
   - create or update the content file on a new branch
     (for example `content/edit-events-<id>`),
   - open a pull request describing the change and who submitted it,
   - record the action in the audit log.
3. Branch protection requires the build check and an admin approval. A
   maintainer reviews and merges. The site deploys.

No direct writes to `main`. Every change is a reviewable PR.

## Worker endpoints (sketch)

Admin (GitHub OAuth session required):

- `POST /admin/links` — create a capability link (label, scope, expiry).
- `GET /admin/links` — list active links.
- `POST /admin/links/:id/revoke` — revoke a link.
- `GET /admin/submissions` — list open content PRs.

Editor (capability token required):

- `GET /edit` — validate token, return the scoped schema and current content.
- `POST /edit` — validate token, open or update a PR.

Internal:

- GitHub App token minting (never exposed).
- Optional GitHub webhook to track PR status.

## Content scope and schema

Drive the editor fields from a config. Reuse the shape of the existing
[`.pages.yml`](../../.pages.yml) collections, or a small parallel config. Start
with the events collection only: title, dates, location, our open hours, the
"confirmed open?" flag, and the body. Add more collections later by editing the
config, not the Worker.

## Security

- The App private key and the signing secret live as Cloudflare Workers
  secrets. Never in the repo.
- Least-privilege App permissions, repo-scoped install.
- Capability tokens are signed, scoped, expiring, revocable, and never logged.
  Serve only over HTTPS. Consider single-use.
- Rate-limit the editor endpoints per token and per IP.
- Lock CORS to the site origin.
- Audit every issue, use, and revoke.
- Admin authorization checks the GitHub user against the repo's collaborators
  or an allowlist on every request, not just at login.

## Hosting and routing

- Cloudflare Workers plus KV or D1, all on the free tier for this volume. We
  already use Cloudflare for analytics.
- Route the Worker at a path (`/edit`, `/admin`) or a subdomain
  (`admin.ncngmodelrailroad.org`). The static site stays on GitHub Pages. Only
  these paths hit the Worker.
- The GitHub App is free.

No new vendors.

## Phasing

- **Phase 1 (the hard 20%):** GitHub App plus a Worker that turns one posted
  form into a PR. No links and no UI yet. Proves the App auth and the PR flow.
- **Phase 2:** signed capability links, email delivery, expiry, revocation,
  and the editor UI.
- **Phase 3:** the admin management UI (issue, list, revoke, review) and the
  audit log.

## Alternatives considered

- **Pages CMS (current).** Great for editors who have GitHub accounts, but
  login-gated, so no help for no-account folks. Keep it for admins. This design
  is the missing tier beneath it.
- **Decap CMS plus Netlify Identity.** Gives invite-by-email auth, but pulls in
  Netlify Identity and that vendor. This design is the same idea, self-hosted on
  Cloudflare, with no lock-in.
- **GitHub Issue Forms.** Native and zero-infra, and we already added an Event
  form. Still requires a GitHub account to submit. Good for board members, not
  for volunteers without a GitHub account.

## Open decisions

- Single-use or reusable links?
- Bind a link to a confirmed email, or possession-only?
- KV or D1 for the store?
- Which collections beyond events?
- Admin allowlist: repo collaborators, or an explicit list?

## Rough effort

- Phase 1: a focused day or two.
- Phases 2 and 3: a few more days, mostly the two UIs and the link lifecycle.

A real project, not a weekend toy, but well-scoped and low-infra.
