/**
 * GitHub App authentication.
 *
 * Mints an RS256 JWT from the App private key (Web Crypto, no extra libraries),
 * then exchanges it for a short-lived installation access token used for all
 * repo writes. The token is cached in-isolate until shortly before it expires.
 */
import type { Env } from '../config';
import { base64Encode, base64urlEncode, base64DecodeToBytes, utf8 } from '../util/encoding';

let cachedToken: { token: string; expiresAt: number } | null = null;

function pemToPkcs8Bytes(pem: string): Uint8Array {
  const normalized = pem.replace(/\\n/g, '\n');
  if (/BEGIN RSA PRIVATE KEY/.test(normalized)) {
    throw new Error(
      'GITHUB_APP_PRIVATE_KEY is in PKCS#1 format ("BEGIN RSA PRIVATE KEY"). ' +
        'Convert it to PKCS#8 first: ' +
        'openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in app.pem -out app.pkcs8.pem',
    );
  }
  const body = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  return base64DecodeToBytes(body);
}

async function importSigningKey(env: Env): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8',
    pemToPkcs8Bytes(env.GITHUB_APP_PRIVATE_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

/** Build a GitHub App JWT (10 minute lifetime, 60s backdated for clock skew). */
export async function buildAppJwt(env: Env, now = Math.floor(Date.now() / 1000)): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = { iat: now - 60, exp: now + 9 * 60, iss: env.GITHUB_APP_ID };
  const signingInput = `${base64urlEncode(JSON.stringify(header))}.${base64urlEncode(
    JSON.stringify(payload),
  )}`;
  const key = await importSigningKey(env);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, utf8(signingInput));
  return `${signingInput}.${base64urlEncode(sig)}`;
}

const API = 'https://api.github.com';

function appHeaders(jwt: string): HeadersInit {
  return {
    Authorization: `Bearer ${jwt}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'ncng-content-editor',
  };
}

/** Get (and cache) an installation access token for repo writes. */
export async function getInstallationToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.token;

  const jwt = await buildAppJwt(env, now);
  const res = await fetch(
    `${API}/app/installations/${env.GITHUB_APP_INSTALLATION_ID}/access_tokens`,
    { method: 'POST', headers: appHeaders(jwt) },
  );
  if (!res.ok) {
    throw new Error(`Failed to mint installation token: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { token: string; expires_at: string };
  cachedToken = { token: data.token, expiresAt: Math.floor(Date.parse(data.expires_at) / 1000) };
  return data.token;
}

/** Test seam: clear the in-isolate token cache. */
export function resetTokenCache(): void {
  cachedToken = null;
}

export { base64Encode };
