import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/index';
import { mintCapabilityToken } from '../src/auth/capability';
import type { Env } from '../src/config';
import type { CapabilityRecord } from '../src/store/kv';

class MockKV {
  store = new Map<string, string>();
  async get(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  async put(key: string, value: string) {
    this.store.set(key, value);
  }
  async delete(key: string) {
    this.store.delete(key);
  }
  async list({ prefix }: { prefix?: string; cursor?: string } = {}) {
    const keys = [...this.store.keys()]
      .filter((k) => !prefix || k.startsWith(prefix))
      .map((name) => ({ name }));
    return { keys, list_complete: true, cursor: '' };
  }
}

const CAP_SECRET = 'capability-secret-key-for-tests-32bytes';

function makeEnv(kv: MockKV): Env {
  return {
    EDITOR_KV: kv as unknown as KVNamespace,
    GITHUB_OWNER: 'owner',
    GITHUB_REPO: 'repo',
    BASE_BRANCH: 'main',
    GITHUB_APP_ID: '1',
    GITHUB_APP_INSTALLATION_ID: '1',
    GITHUB_OAUTH_CLIENT_ID: 'client-id',
    WORKER_ORIGIN: 'https://edit.example.org',
    SITE_ORIGIN: 'https://example.org',
    ADMIN_ALLOWLIST: 'allowed-admin',
    GITHUB_APP_PRIVATE_KEY: '',
    GITHUB_OAUTH_CLIENT_SECRET: 'oauth-secret',
    CAPABILITY_SIGNING_KEY: CAP_SECRET,
    SESSION_SIGNING_KEY: 'session-secret-key-for-tests-32bytesxx',
  };
}

const ctx = { waitUntil() {}, passThroughOnException() {} } as unknown as ExecutionContext;

function req(path: string, init?: RequestInit) {
  return new Request(`https://edit.example.org${path}`, init);
}

async function storedCapability(kv: MockKV, overrides: Partial<CapabilityRecord> = {}) {
  const minted = await mintCapabilityToken(CAP_SECRET, { scope: 'events:write', ttlSeconds: 3600 });
  const rec: CapabilityRecord = {
    id: minted.id,
    label: 'private label',
    scope: 'events:write',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    revoked: false,
    use_count: 0,
    max_uses: 0,
    last_used_at: null,
    ...overrides,
  };
  await kv.put('cap:' + minted.id, JSON.stringify(rec));
  return { token: minted.token, rec };
}

let kv: MockKV;
let env: Env;
beforeEach(() => {
  kv = new MockKV();
  env = makeEnv(kv);
});

describe('public routes', () => {
  it('redirects / to the site', async () => {
    const res = await app.fetch(req('/'), env, ctx);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://example.org');
  });

  it('serves /healthz', async () => {
    const res = await app.fetch(req('/healthz'), env, ctx);
    expect(await res.text()).toBe('ok');
  });

  it('serves the editor with a script nonce and tight CSP', async () => {
    const res = await app.fetch(req('/edit'), env, ctx);
    expect(res.status).toBe(200);
    const csp = res.headers.get('content-security-policy') || '';
    expect(csp).toMatch(/script-src 'nonce-/);
    const html = await res.text();
    const nonce = csp.match(/nonce-([^']+)/)![1];
    expect(html).toContain(`<script nonce="${nonce}">`);
  });
});

describe('editor token gating', () => {
  it('rejects /edit/load without a token', async () => {
    const res = await app.fetch(
      req('/edit/load', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
  });

  it('rejects /edit/submit with an invalid token', async () => {
    const res = await app.fetch(
      req('/edit/submit', {
        method: 'POST',
        body: JSON.stringify({ token: 'not.valid' }),
        headers: { 'content-type': 'application/json' },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
  });

  it('accepts a valid token but reports field errors (no network)', async () => {
    const { token } = await storedCapability(kv);
    const res = await app.fetch(
      req('/edit/submit', {
        method: 'POST',
        body: JSON.stringify({ token, title: '', date: '', location: '' }),
        headers: { 'content-type': 'application/json' },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(400);
    const data = (await res.json()) as { errors: string[] };
    expect(data.errors).toContain('Title is required.');
  });

  it('rejects a revoked capability', async () => {
    const { token } = await storedCapability(kv, { revoked: true });
    const res = await app.fetch(
      req('/edit/submit', {
        method: 'POST',
        body: JSON.stringify({ token, title: 'x', date: '2026-01-01', location: 'y' }),
        headers: { 'content-type': 'application/json' },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
  });

  it('rejects a capability over its use limit', async () => {
    const { token } = await storedCapability(kv, { max_uses: 1, use_count: 1 });
    const res = await app.fetch(
      req('/edit/submit', {
        method: 'POST',
        body: JSON.stringify({ token, title: 'x', date: '2026-01-01', location: 'y' }),
        headers: { 'content-type': 'application/json' },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
  });

  it('refuses to update a path outside the events collection', async () => {
    const { token } = await storedCapability(kv);
    const res = await app.fetch(
      req('/edit/submit', {
        method: 'POST',
        body: JSON.stringify({
          token,
          mode: 'update',
          path: '.github/workflows/deploy.yml',
          title: 'Pwned',
          date: '2026-01-01',
          location: 'anywhere',
        }),
        headers: { 'content-type': 'application/json' },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(403);
  });

  it('rejects a path traversal attempt in an update', async () => {
    const { token } = await storedCapability(kv);
    const res = await app.fetch(
      req('/edit/submit', {
        method: 'POST',
        body: JSON.stringify({
          token,
          mode: 'update',
          path: 'src/content/events/../../../etc/passwd.md',
          title: 'x',
          date: '2026-01-01',
          location: 'y',
        }),
        headers: { 'content-type': 'application/json' },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(403);
  });
});

describe('admin gating', () => {
  it('shows sign-in when unauthenticated', async () => {
    const res = await app.fetch(req('/admin'), env, ctx);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Sign in with GitHub');
  });

  it('blocks link creation without a session', async () => {
    const res = await app.fetch(
      req('/admin/links', {
        method: 'POST',
        body: 'label=x&scope=events:write&days=30',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }),
      env,
      ctx,
    );
    expect(await res.text()).toContain('Sign in with GitHub');
  });

  it('redirects /admin/login to GitHub', async () => {
    const res = await app.fetch(req('/admin/login'), env, ctx);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('github.com/login/oauth/authorize');
    expect(res.headers.get('location')).toContain('client_id=client-id');
  });
});
