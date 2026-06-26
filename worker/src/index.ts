/**
 * Magic-link content editor — Cloudflare Worker entry point.
 *
 * Routes:
 *   GET  /                      → redirect to the public site
 *   GET  /healthz               → liveness
 *   GET  /edit                  → no-account editor (token lives in the URL fragment)
 *   POST /edit/load             → validate token, return scoped content
 *   POST /edit/submit           → validate token, open a pull request
 *   GET  /admin                 → dashboard (GitHub OAuth gated)
 *   GET  /admin/login|callback  → OAuth dance
 *   POST /admin/links           → mint a capability link
 *   POST /admin/links/:id/revoke→ revoke a link
 *   GET  /admin/logout          → clear session
 *
 * PUBLIC REPO: capability labels ("who it is for") are private and live only in
 * KV. They are never written into commits, branches, or pull requests.
 */
import { Hono } from 'hono';
import { getSignedCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import type { Context } from 'hono';
import type { Env } from './config';
import { EDIT_BRANCH_PREFIX, isScope } from './config';
import { mintCapabilityToken, verifyCapabilityToken } from './auth/capability';
import * as store from './store/kv';
import * as gh from './github/api';
import { buildAuthorizeUrl, exchangeCodeForToken, fetchLogin, isAdmin } from './github/oauth';
import { editorPage } from './ui/editor';
import { signInPage, dashboard } from './ui/admin';
import {
  type EventInput,
  eventPath,
  parseEvent,
  serializeEvent,
  validateEvent,
} from './content/events';
import { randomId } from './util/encoding';

type Vars = { session?: AdminSession };
interface AdminSession {
  login: string;
  csrf: string;
  exp: number;
}
type AppContext = Context<{ Bindings: Env; Variables: Vars }>;

const SESSION_COOKIE = 'ncng_admin';
const STATE_COOKIE = 'ncng_oauth_state';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

/**
 * An events-scoped link may only ever touch event Markdown files. This guard
 * stops a link holder from steering an update at an arbitrary repo path
 * (a workflow, config, or source file).
 */
const EVENT_PATH_RE = /^src\/content\/events\/[A-Za-z0-9._-]+\.md$/;
function isEventPath(path: string): boolean {
  return EVENT_PATH_RE.test(path) && !path.includes('..');
}

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

// --- helpers ---------------------------------------------------------------

function secureHtml(c: Context, html: string, nonce?: string): Response {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'no-referrer');
  c.header('X-Frame-Options', 'DENY');
  // These pages carry private labels and one-time links; keep them out of caches.
  c.header('Cache-Control', 'no-store');
  const scriptSrc = nonce ? `script-src 'nonce-${nonce}'; connect-src 'self'; ` : `script-src 'none'; `;
  c.header(
    'Content-Security-Policy',
    `default-src 'none'; ${scriptSrc}style-src 'unsafe-inline'; img-src 'self' data:; ` +
      `form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
  );
  return c.html(html);
}

const secureCookie = {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax' as const,
  path: '/',
};

function eventFromBody(b: Record<string, unknown>): EventInput {
  const s = (v: unknown) => (v == null ? '' : String(v));
  const featured = b.featured;
  return {
    title: s(b.title),
    date: s(b.date),
    endDate: b.endDate ? s(b.endDate) : undefined,
    location: s(b.location),
    description: b.description ? s(b.description) : undefined,
    featured: featured === true || featured === 'true' || featured === 'on',
    body: s(b.body),
  };
}

type CapResult =
  | { ok: true; id: string; record: store.CapabilityRecord }
  | { ok: false; status: number; error: string };

async function validateCapability(
  env: Env,
  token: unknown,
  requiredScope: string,
): Promise<CapResult> {
  if (typeof token !== 'string' || !token) {
    return { ok: false, status: 401, error: 'This editor link is missing its access token.' };
  }
  const v = await verifyCapabilityToken(token, env.CAPABILITY_SIGNING_KEY);
  if (!v.ok) {
    return {
      ok: false,
      status: 401,
      error: v.reason === 'expired' ? 'This link has expired.' : 'This link is not valid.',
    };
  }
  if (v.claims.scope !== requiredScope) {
    return { ok: false, status: 403, error: 'This link cannot edit that content.' };
  }
  const rec = await store.getCapability(env, v.claims.id);
  if (!rec || rec.revoked) {
    return { ok: false, status: 401, error: 'This link has been turned off.' };
  }
  if (Date.parse(rec.expires_at) <= Date.now()) {
    return { ok: false, status: 401, error: 'This link has expired.' };
  }
  if (rec.max_uses > 0 && rec.use_count >= rec.max_uses) {
    return { ok: false, status: 401, error: 'This link has reached its use limit.' };
  }
  return { ok: true, id: rec.id, record: rec };
}

async function readSession(c: AppContext): Promise<AdminSession | null> {
  const raw = await getSignedCookie(c, c.env.SESSION_SIGNING_KEY, SESSION_COOKIE);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as AdminSession;
    if (!s.login || s.exp <= Math.floor(Date.now() / 1000)) return null;
    return s;
  } catch {
    return null;
  }
}

// --- public routes ---------------------------------------------------------

app.get('/', (c) => c.redirect(c.env.SITE_ORIGIN, 302));
app.get('/healthz', (c) => c.text('ok'));

app.get('/edit', (c) => {
  const nonce = randomId(16);
  return secureHtml(c, editorPage(nonce), nonce);
});

app.post('/edit/load', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as { token?: string };
  const cap = await validateCapability(c.env, body.token, 'events:write');
  if (!cap.ok) return c.json({ error: cap.error }, cap.status as 401 | 403);

  const dir = await gh.listDir(c.env, 'src/content/events', c.env.BASE_BRANCH);
  const files = dir.filter((e) => e.type === 'file' && e.name.endsWith('.md')).slice(0, 100);
  const events = [];
  for (const f of files) {
    const file = await gh.getFile(c.env, f.path, c.env.BASE_BRANCH);
    if (!file) continue;
    const input = parseEvent(file.text);
    events.push({ path: f.path, title: input.title || f.name, input, sha: file.sha });
  }
  events.sort((a, b) => (a.input.date < b.input.date ? 1 : -1));
  return c.json({ ok: true, scope: 'events:write', events });
});

app.post('/edit/submit', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const cap = await validateCapability(c.env, body.token, 'events:write');
  if (!cap.ok) return c.json({ error: cap.error }, cap.status as 401 | 403);

  const input = eventFromBody(body);
  const errors = validateEvent(input);
  if (errors.length) return c.json({ errors }, 400);

  const mode = body.mode === 'update' ? 'update' : 'create';

  // Resolve and lock down the target path before any write. An events-scoped
  // link may only create a new event file or update an existing event file.
  let filePath: string;
  let sha: string | undefined;
  if (mode === 'update') {
    const requested = String(body.path ?? '');
    if (!isEventPath(requested)) {
      return c.json({ error: 'That file cannot be edited with this link.' }, 403);
    }
    filePath = requested;
    const current = await gh.getFile(c.env, filePath, c.env.BASE_BRANCH);
    if (!current) {
      return c.json({ error: 'That event no longer exists. Reload and try again.' }, 409);
    }
    const loadedSha = String(body.sha ?? '');
    if (!loadedSha) {
      return c.json({ error: 'Missing version marker. Reload the event and try again.' }, 400);
    }
    if (loadedSha !== current.sha) {
      return c.json(
        { error: 'This event changed since you opened it. Reload and reapply your edit.' },
        409,
      );
    }
    sha = current.sha;
  } else {
    filePath = eventPath(input);
    const existing = await gh.getFile(c.env, filePath, c.env.BASE_BRANCH);
    if (existing) {
      return c.json(
        { error: 'An event with that date and title already exists. Edit it instead, or change the title.' },
        409,
      );
    }
  }

  // Fork a fresh branch off the base and commit there. Never write to the base.
  const baseSha = await gh.getBranchSha(c.env, c.env.BASE_BRANCH);
  const branch = `${EDIT_BRANCH_PREFIX}events-${cap.id.slice(0, 8)}-${randomId(4)}`;
  await gh.createBranch(c.env, branch, baseSha);

  await gh.putFile(c.env, {
    path: filePath,
    branch,
    message: `${mode === 'update' ? 'Update' : 'Add'} event: ${input.title}`,
    text: serializeEvent(input),
    sha,
  });

  const pr = await gh.openPullRequest(c.env, {
    head: branch,
    title: `Content: ${mode === 'update' ? 'update' : 'add'} event "${input.title}"`,
    body:
      `Submitted through a content editor link.\n\n` +
      `- Scope: \`events:write\`\n- Link id: \`${cap.id.slice(0, 8)}…\`\n- File: \`${filePath}\`\n\n` +
      `Review the change and merge to publish. The build check must pass first.`,
  });

  // The pull request now exists. Bookkeeping is best-effort: never fail the
  // request (and tempt a duplicate retry) just because a KV write hiccups.
  try {
    await store.recordUse(c.env, cap.id);
    await store.appendAudit(c.env, {
      ts: new Date().toISOString(),
      actor: cap.id,
      action: mode === 'update' ? 'edit-event' : 'add-event',
      target: filePath,
      result: `pr#${pr.number}`,
    });
  } catch (e) {
    console.error('post-PR bookkeeping failed', e);
  }

  return c.json({ ok: true, prUrl: pr.html_url, number: pr.number });
});

// --- admin routes ----------------------------------------------------------

app.get('/admin/login', async (c) => {
  const state = randomId(16);
  await setSignedCookie(c, STATE_COOKIE, state, c.env.SESSION_SIGNING_KEY, {
    ...secureCookie,
    maxAge: 600,
  });
  return c.redirect(buildAuthorizeUrl(c.env, state), 302);
});

app.get('/admin/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const expected = await getSignedCookie(c, c.env.SESSION_SIGNING_KEY, STATE_COOKIE);
  deleteCookie(c, STATE_COOKIE, { path: '/' });

  if (!code || !state || !expected || state !== expected) {
    return secureHtml(c, signInPage('Sign-in could not be verified. Please try again.'));
  }

  let login: string;
  try {
    const token = await exchangeCodeForToken(c.env, code);
    login = await fetchLogin(token);
  } catch {
    return secureHtml(c, signInPage('GitHub sign-in failed. Please try again.'));
  }

  if (!isAdmin(c.env, login)) {
    await store.appendAudit(c.env, {
      ts: new Date().toISOString(),
      actor: login,
      action: 'admin-login-denied',
      result: 'not-on-allowlist',
    });
    return secureHtml(c, signInPage('That account is not allowed into the admin area.'));
  }

  const session: AdminSession = {
    login,
    csrf: randomId(16),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  await setSignedCookie(c, SESSION_COOKIE, JSON.stringify(session), c.env.SESSION_SIGNING_KEY, {
    ...secureCookie,
    maxAge: SESSION_TTL_SECONDS,
  });
  await store.appendAudit(c.env, {
    ts: new Date().toISOString(),
    actor: login,
    action: 'admin-login',
    result: 'ok',
  });
  return c.redirect('/admin', 302);
});

app.get('/admin/logout', (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
  return c.redirect('/admin', 302);
});

app.get('/admin', async (c) => {
  const session = await readSession(c);
  if (!session) return secureHtml(c, signInPage());

  let submissions: gh.PullRequest[] = [];
  let notice: string | undefined;
  try {
    submissions = await gh.listEditorPulls(c.env);
  } catch {
    notice = 'Could not reach GitHub to list submissions. Check the App configuration.';
  }
  const [links, audit] = await Promise.all([
    store.listCapabilities(c.env),
    store.listAudit(c.env, 25),
  ]);

  return secureHtml(
    c,
    dashboard({
      login: session.login,
      csrf: session.csrf,
      workerOrigin: c.env.WORKER_ORIGIN,
      links,
      submissions,
      audit,
      notice,
    }),
  );
});

app.post('/admin/links', async (c) => {
  const session = await readSession(c);
  if (!session) return secureHtml(c, signInPage());
  const form = await c.req.parseBody();
  if (form.csrf !== session.csrf) return c.text('Bad request', 400);

  const label = String(form.label ?? '').trim();
  const scope = String(form.scope ?? '');
  const days = Math.max(1, Math.min(365, parseInt(String(form.days ?? '30'), 10) || 30));
  const maxUses = Math.max(0, parseInt(String(form.max_uses ?? '0'), 10) || 0);

  if (!label || !isScope(scope)) return c.text('Invalid input', 400);

  const minted = await mintCapabilityToken(c.env.CAPABILITY_SIGNING_KEY, {
    scope,
    ttlSeconds: days * 86400,
  });
  const now = new Date();
  await store.createCapability(c.env, {
    id: minted.id,
    label,
    scope,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + days * 86400 * 1000).toISOString(),
    revoked: false,
    use_count: 0,
    max_uses: maxUses,
    last_used_at: null,
  });
  await store.appendAudit(c.env, {
    ts: now.toISOString(),
    actor: session.login,
    action: 'create-link',
    target: minted.id,
    result: `scope=${scope} days=${days}`,
  });

  const [links, audit] = await Promise.all([
    store.listCapabilities(c.env),
    store.listAudit(c.env, 25),
  ]);
  let submissions: gh.PullRequest[] = [];
  try {
    submissions = await gh.listEditorPulls(c.env);
  } catch {
    /* tolerate */
  }
  return secureHtml(
    c,
    dashboard({
      login: session.login,
      csrf: session.csrf,
      workerOrigin: c.env.WORKER_ORIGIN,
      links,
      submissions,
      audit,
      newLinkUrl: `${c.env.WORKER_ORIGIN}/edit#t=${minted.token}`,
    }),
  );
});

app.post('/admin/links/:id/revoke', async (c) => {
  const session = await readSession(c);
  if (!session) return secureHtml(c, signInPage());
  const form = await c.req.parseBody();
  if (form.csrf !== session.csrf) return c.text('Bad request', 400);

  const id = c.req.param('id');
  const ok = await store.revokeCapability(c.env, id);
  await store.appendAudit(c.env, {
    ts: new Date().toISOString(),
    actor: session.login,
    action: 'revoke-link',
    target: id,
    result: ok ? 'ok' : 'not-found',
  });
  return c.redirect('/admin', 303);
});

app.notFound((c) => c.text('Not found', 404));
app.onError((err, c) => {
  console.error('worker error', err);
  if (c.req.path.startsWith('/edit/')) return c.json({ error: 'Something went wrong.' }, 500);
  return c.text('Something went wrong.', 500);
});

export default app;
