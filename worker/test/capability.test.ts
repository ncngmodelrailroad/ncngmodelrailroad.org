import { describe, it, expect } from 'vitest';
import {
  mintCapabilityToken,
  verifyCapabilityToken,
} from '../src/auth/capability';

const SECRET = 'test-capability-signing-key-please-32b';

describe('capability tokens', () => {
  it('mints and verifies a valid token', async () => {
    const { token, id } = await mintCapabilityToken(SECRET, {
      scope: 'events:write',
      ttlSeconds: 3600,
      now: 1000,
    });
    const result = await verifyCapabilityToken(token, SECRET, 1500);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.id).toBe(id);
      expect(result.claims.scope).toBe('events:write');
      expect(result.claims.exp).toBe(4600);
    }
  });

  it('rejects a tampered signature', async () => {
    const { token } = await mintCapabilityToken(SECRET, { scope: 'events:write', ttlSeconds: 3600 });
    const tampered = token.slice(0, -2) + (token.endsWith('a') ? 'bb' : 'aa');
    const result = await verifyCapabilityToken(tampered, SECRET);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('bad-signature');
  });

  it('rejects a token signed with a different secret', async () => {
    const { token } = await mintCapabilityToken(SECRET, { scope: 'events:write', ttlSeconds: 3600 });
    const result = await verifyCapabilityToken(token, 'a-totally-different-secret-value-32b');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('bad-signature');
  });

  it('rejects an expired token', async () => {
    const { token } = await mintCapabilityToken(SECRET, {
      scope: 'events:write',
      ttlSeconds: 10,
      now: 1000,
    });
    const result = await verifyCapabilityToken(token, SECRET, 2000);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('expired');
  });

  it('rejects malformed tokens', async () => {
    for (const bad of ['', 'nodot', '.', 'a.', '.b']) {
      const result = await verifyCapabilityToken(bad, SECRET);
      expect(result.ok).toBe(false);
    }
  });
});
