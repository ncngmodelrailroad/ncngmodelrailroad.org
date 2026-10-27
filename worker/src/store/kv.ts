/**
 * KV-backed store for issued capabilities (links) and the audit log.
 *
 * PUBLIC REPO note: a capability's `label` ("who it is for") is private and is
 * kept only here in KV. It must never be written into a commit, branch, PR, or
 * any other public surface.
 */
import type { Env, Scope } from '../config';

const CAP_PREFIX = 'cap:';
const AUDIT_PREFIX = 'audit:';

export interface CapabilityRecord {
  id: string;
  /** Private label for the admin's own reference. Never exposed publicly. */
  label: string;
  scope: Scope;
  created_at: string;
  expires_at: string;
  revoked: boolean;
  use_count: number;
  /** 0 means unlimited. */
  max_uses: number;
  last_used_at: string | null;
}

export interface AuditEntry {
  ts: string;
  /** Capability id or admin login responsible for the action. */
  actor: string;
  action: string;
  target?: string;
  result: string;
}

export async function createCapability(env: Env, rec: CapabilityRecord): Promise<void> {
  await env.EDITOR_KV.put(CAP_PREFIX + rec.id, JSON.stringify(rec));
}

export async function getCapability(env: Env, id: string): Promise<CapabilityRecord | null> {
  const raw = await env.EDITOR_KV.get(CAP_PREFIX + id);
  return raw ? (JSON.parse(raw) as CapabilityRecord) : null;
}

export async function listCapabilities(env: Env): Promise<CapabilityRecord[]> {
  const out: CapabilityRecord[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.EDITOR_KV.list({ prefix: CAP_PREFIX, cursor });
    for (const key of page.keys) {
      const raw = await env.EDITOR_KV.get(key.name);
      if (raw) out.push(JSON.parse(raw) as CapabilityRecord);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  out.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return out;
}

export async function revokeCapability(env: Env, id: string): Promise<boolean> {
  const rec = await getCapability(env, id);
  if (!rec) return false;
  rec.revoked = true;
  await createCapability(env, rec);
  return true;
}

/** Record one use: bump the counter and timestamp. */
export async function recordUse(env: Env, id: string): Promise<void> {
  const rec = await getCapability(env, id);
  if (!rec) return;
  rec.use_count += 1;
  rec.last_used_at = new Date().toISOString();
  await createCapability(env, rec);
}

export async function appendAudit(env: Env, entry: AuditEntry): Promise<void> {
  // Key sorts newest-last lexically; we reverse on read.
  const key = `${AUDIT_PREFIX}${entry.ts}:${crypto.randomUUID()}`;
  await env.EDITOR_KV.put(key, JSON.stringify(entry));
}

export async function listAudit(env: Env, limit = 100): Promise<AuditEntry[]> {
  const out: AuditEntry[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.EDITOR_KV.list({ prefix: AUDIT_PREFIX, cursor });
    for (const key of page.keys) {
      const raw = await env.EDITOR_KV.get(key.name);
      if (raw) out.push(JSON.parse(raw) as AuditEntry);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  out.sort((a, b) => b.ts.localeCompare(a.ts));
  return out.slice(0, limit);
}
