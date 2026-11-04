/**
 * Admin authentication via GitHub OAuth.
 *
 * OAuth is used only to prove control of a GitHub account. We request no
 * scopes; we just read the login from /user and check it against
 * ADMIN_ALLOWLIST. Least privilege: the OAuth token can do nothing on the repo.
 */
import type { Env } from '../config';
import { adminAllowlist } from '../config';

export function buildAuthorizeUrl(env: Env, state: string): string {
  const params = new URLSearchParams({
    client_id: env.GITHUB_OAUTH_CLIENT_ID,
    redirect_uri: `${env.WORKER_ORIGIN}/admin/callback`,
    state,
    allow_signup: 'false',
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(env: Env, code: string): Promise<string> {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${env.WORKER_ORIGIN}/admin/callback`,
    }),
  });
  if (!res.ok) throw new Error(`OAuth token exchange failed: ${res.status}`);
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(`OAuth token exchange error: ${data.error ?? 'unknown'}`);
  return data.access_token;
}

export async function fetchLogin(token: string): Promise<string> {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ncng-content-editor',
    },
  });
  if (!res.ok) throw new Error(`Failed to read GitHub user: ${res.status}`);
  const data = (await res.json()) as { login: string };
  return data.login;
}

export function isAdmin(env: Env, login: string): boolean {
  return adminAllowlist(env).has(login.toLowerCase());
}
