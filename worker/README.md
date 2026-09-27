# Content editor Worker

A Cloudflare Worker that gives non-GitHub volunteers a no-account way to edit
site content. It issues signed "magic link" capability URLs, opens a scoped
editor form, and turns each submission into a pull request a maintainer
approves. Admins manage the links from a GitHub-OAuth-gated dashboard.

Design and rationale: [`../docs/design/content-editor.md`](../docs/design/content-editor.md).

This directory is a standalone project. It does not affect the Astro site build
or the GitHub Pages deploy. The static site stays on Pages; only the `/edit` and
`/admin` paths reach the Worker.

> Public repo: this code holds no secrets, and no individual is named anywhere
> in it. A capability's private label lives only in KV. Keep it that way.

## What it does

- `GET /edit` opens the editor. The capability token rides in the URL fragment
  (`#t=...`), so it never lands in a server log or a referrer header.
- `POST /edit/load` and `POST /edit/submit` validate the token, read the current
  events, and open a pull request on a fresh `content/edit-*` branch.
- `GET /admin` is the dashboard. Sign in with GitHub, create and revoke links,
  and review open submissions. Access is limited to the `ADMIN_ALLOWLIST`.

Scope today is the events collection only. Add a collection by adding a content
type under `src/content/` and a scope in `src/config.ts`.

## Architecture

```
Admin ──GitHub OAuth──▶ /admin ──creates──▶ capability link (signed, scoped, expiring)
Volunteer ──opens /edit#t=token──▶ editor form ──▶ Worker validates ──▶ GitHub App ──▶ PR
                                                                          │
Branch protection (build check + admin approval) ──merge──▶ Pages deploy ◀┘
```

Three identities stay separate: the GitHub App (Worker to repo), the admin
(person to dashboard, via OAuth), and the capability link (volunteer to editor).

## Prerequisites

- A Cloudflare account (the free tier covers this volume).
- Permission to create a GitHub App and an OAuth App on the repo.
- Node 20+ and `npm`.

## Setup

Run everything below from this `worker/` directory.

```bash
npm install
```

### 1. Create the GitHub App (Worker to repo)

GitHub → Settings → Developer settings → GitHub Apps → New GitHub App.

- Homepage URL: your site.
- Webhook: uncheck "Active" (not needed).
- Repository permissions:
  - Contents: Read and write
  - Pull requests: Read and write
  - Everything else: No access
- Where can this app be installed: Only on this account.

Create it, then:

1. Note the App ID.
2. Generate a private key. GitHub downloads a PKCS#1 PEM
   (`-----BEGIN RSA PRIVATE KEY-----`). Convert it to PKCS#8 once:
   ```bash
   openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt \
     -in your-app.private-key.pem -out app.pkcs8.pem
   ```
   The Worker requires PKCS#8 (`-----BEGIN PRIVATE KEY-----`) and refuses
   PKCS#1 with a clear error.
3. Install the App on this repository.
4. Find the Installation ID. Open the installation under Settings →
   Applications → the App → Configure; the number at the end of the URL is the
   installation id. (Or call `GET /repos/{owner}/{repo}/installation` with an
   App JWT.)

### 2. Create the OAuth App (admin sign-in)

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.

- Authorization callback URL: `https://YOUR_WORKER_ORIGIN/admin/callback`
- Note the Client ID and generate a Client secret.

The admin OAuth flow requests no scopes. It reads only the login name and checks
it against the allowlist.

### 3. Create the KV namespace

```bash
npx wrangler kv namespace create EDITOR_KV
```

Copy the printed `id` into `wrangler.jsonc` under `kv_namespaces`.

### 4. Fill in `wrangler.jsonc`

Set the non-secret `vars`:

- `GITHUB_OWNER`, `GITHUB_REPO`, `BASE_BRANCH`
- `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`
- `GITHUB_OAUTH_CLIENT_ID`
- `WORKER_ORIGIN` (where this Worker serves, e.g. `https://edit.example.org`)
- `SITE_ORIGIN` (the public site)
- `ADMIN_ALLOWLIST` (comma-separated GitHub logins allowed into `/admin`)

### 5. Set the secrets

Generate two random signing keys and set all four secrets:

```bash
openssl rand -base64 32   # use one value for each signing key below

npx wrangler secret put CAPABILITY_SIGNING_KEY
npx wrangler secret put SESSION_SIGNING_KEY
npx wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
npx wrangler secret put GITHUB_APP_PRIVATE_KEY < app.pkcs8.pem
```

Delete the local key files afterward. They are git-ignored, but do not keep
them around.

### 6. Deploy and route

```bash
npx wrangler deploy
```

Route the Worker at `WORKER_ORIGIN`. A subdomain such as
`edit.example.org` mapped to the Worker is the simplest option, and it keeps the
static site on Pages untouched. Configure the route or custom domain in the
Cloudflare dashboard or in `wrangler.jsonc`.

### 7. Use it

1. Open `https://YOUR_WORKER_ORIGIN/admin` and sign in.
2. Create a link: give it a private label, pick the scope, set an expiry.
3. Copy the link once and send it privately to the one person who should use it.
4. They open it, edit, and submit. A pull request appears for review.
5. Approve and merge. The build check runs first; the site deploys on merge.

## Local development

```bash
# Put dev placeholders in .dev.vars (git-ignored). Example:
#   CAPABILITY_SIGNING_KEY="dev-...-32-bytes"
#   SESSION_SIGNING_KEY="dev-...-32-bytes"
#   GITHUB_OAUTH_CLIENT_SECRET="dev"
#   GITHUB_APP_PRIVATE_KEY="dev"
npm run dev      # wrangler dev, local mode
```

Editor and admin auth gates work locally. Routes that call GitHub (loading and
submitting content) need a real App and run against the live repo.

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest: token crypto, content type, route gates
npm run dry-run     # bundle without deploying
```

`npm test` covers the parts that need no network: capability token signing and
verification, the events serializer and parser, and every auth gate.

## Security notes

- Secrets live only as Workers secrets. Never commit them. `.pem`, `.key`, and
  `.dev.vars` are git-ignored.
- The GitHub App uses least privilege: Contents and Pull requests only.
- Capability tokens are HMAC-signed, scoped, expiring, and revocable. The id is
  checked against KV on every use, so revoking a link kills it at once.
- The Worker writes only to `content/edit-*` branches and never to the base
  branch. Branch protection plus an admin review gates every publish.
- An events link can only create or update files under `src/content/events/`.
  The server validates the target path on every update and rejects anything
  else, so a link cannot be steered at a workflow, config, or source file.
- Event fields reject raw HTML (`<`/`>`) and stray control characters, and the
  site sanitizes rendered Markdown, so a submission cannot run script on the
  published page. Review the rendered diff before merging regardless.
- Use limits and link reuse are best-effort. KV is eventually consistent, so a
  burst of concurrent submissions can exceed `max_uses`. Revocation and expiry
  are enforced on every use.
- Admin POST actions carry a CSRF token tied to the signed session cookie.
- Responses set a strict Content-Security-Policy, `no-referrer`, `nosniff`, and
  `X-Frame-Options: DENY`.

## Phases

This build covers the design doc's phases 1 through 3 in code: the App and PR
flow, signed capability links with expiry and revocation, and the admin
dashboard with an audit log. What remains is yours to run: create the App and
OAuth App, set the secrets, deploy, route the origin, and send the links.

Possible next steps, when wanted: email delivery of links from the dashboard,
single-use links, per-IP rate limiting (Cloudflare rules), and more collections.
