/**
 * Environment bindings and shared configuration.
 *
 * PUBLIC REPO: nothing secret lives here. The fields marked "secret" below are
 * injected at runtime by `wrangler secret put` and never appear in source.
 */
export interface Env {
  /** KV namespace: issued capabilities + audit log. */
  EDITOR_KV: KVNamespace;

  // --- non-secret vars (wrangler.jsonc) ---
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  /** Branch new content PRs target, e.g. "main". */
  BASE_BRANCH: string;
  GITHUB_APP_ID: string;
  GITHUB_APP_INSTALLATION_ID: string;
  GITHUB_OAUTH_CLIENT_ID: string;
  /** Public origin this Worker is served from, e.g. https://edit.example.org */
  WORKER_ORIGIN: string;
  /** The static site origin, used for links back and CSP, e.g. https://example.org */
  SITE_ORIGIN: string;
  /** Comma-separated GitHub logins allowed into /admin. */
  ADMIN_ALLOWLIST?: string;

  // --- secrets (wrangler secret put) ---
  /** GitHub App private key, PKCS#8 PEM ("BEGIN PRIVATE KEY"). */
  GITHUB_APP_PRIVATE_KEY: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  /** Random 32+ byte secret; HMAC key for capability links. */
  CAPABILITY_SIGNING_KEY: string;
  /** Random 32+ byte secret; HMAC key for the admin session cookie. */
  SESSION_SIGNING_KEY: string;
}

/**
 * Editable content scopes. Start with events only; add collections by adding
 * a content type module and listing its scope here.
 */
export const SCOPES = ['events:write'] as const;
export type Scope = (typeof SCOPES)[number];

export function isScope(value: string): value is Scope {
  return (SCOPES as readonly string[]).includes(value);
}

/** Branch name prefix for editor-submitted content PRs. */
export const EDIT_BRANCH_PREFIX = 'content/edit-';

/** Parse the admin allowlist into a normalized lowercase set. */
export function adminAllowlist(env: Env): Set<string> {
  return new Set(
    (env.ADMIN_ALLOWLIST ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}
