/**
 * Capability tokens — the "magic link" credential.
 *
 * A token is `base64url(payload).base64url(HMAC-SHA256(payload))`. The payload
 * carries an id, the allowed scope, an expiry, and a nonce. The signature proves
 * we minted it; the id is then checked against KV for revocation and use limits.
 * The token lives in the URL fragment, so it is never sent to a server in a
 * request line and never logged.
 */
import { type Scope, isScope } from '../config';
import {
  base64urlDecodeToString,
  base64urlEncode,
  randomId,
  timingSafeEqual,
  utf8,
} from '../util/encoding';

export interface CapabilityClaims {
  /** Stable id, also the KV key. */
  id: string;
  scope: Scope;
  /** Expiry, unix seconds. */
  exp: number;
  /** Random nonce for uniqueness. */
  n: string;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    utf8(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function sign(payloadB64: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, utf8(payloadB64));
  return base64urlEncode(sig);
}

export interface MintOptions {
  scope: Scope;
  /** Lifetime in seconds. */
  ttlSeconds: number;
  /** Optional pre-chosen id (defaults to a random id). */
  id?: string;
  /** Clock override for tests. */
  now?: number;
}

export interface MintedCapability {
  id: string;
  token: string;
  claims: CapabilityClaims;
}

export async function mintCapabilityToken(
  secret: string,
  opts: MintOptions,
): Promise<MintedCapability> {
  const now = opts.now ?? Math.floor(Date.now() / 1000);
  const claims: CapabilityClaims = {
    id: opts.id ?? randomId(16),
    scope: opts.scope,
    exp: now + opts.ttlSeconds,
    n: randomId(8),
  };
  const payloadB64 = base64urlEncode(JSON.stringify(claims));
  const sig = await sign(payloadB64, secret);
  return { id: claims.id, token: `${payloadB64}.${sig}`, claims };
}

export type VerifyResult =
  | { ok: true; claims: CapabilityClaims }
  | { ok: false; reason: 'malformed' | 'bad-signature' | 'expired' };

/**
 * Verify a token's structure, signature, and expiry. Revocation and use limits
 * are enforced separately against KV by the caller.
 */
export async function verifyCapabilityToken(
  token: string,
  secret: string,
  now = Math.floor(Date.now() / 1000),
): Promise<VerifyResult> {
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: 'malformed' };
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = await sign(payloadB64, secret);
  if (!timingSafeEqual(sig, expected)) return { ok: false, reason: 'bad-signature' };

  let claims: CapabilityClaims;
  try {
    const parsed = JSON.parse(base64urlDecodeToString(payloadB64)) as CapabilityClaims;
    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.exp !== 'number' ||
      typeof parsed.scope !== 'string' ||
      !isScope(parsed.scope)
    ) {
      return { ok: false, reason: 'malformed' };
    }
    claims = parsed;
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  if (claims.exp <= now) return { ok: false, reason: 'expired' };
  return { ok: true, claims };
}
