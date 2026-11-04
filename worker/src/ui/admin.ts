/** Admin pages: sign-in and the management dashboard. */
import type { CapabilityRecord, AuditEntry } from '../store/kv';
import type { PullRequest } from '../github/api';
import { SCOPES } from '../config';
import { esc, layout } from './layout';

export function signInPage(error?: string): string {
  const body = `
<h1>Content editor admin</h1>
<p class="muted">Sign in with GitHub to issue edit links and review submissions.
Only allowed accounts can enter.</p>
${error ? `<div class="notice err">${esc(error)}</div>` : ''}
<p style="margin-top:1.5rem"><a class="btn" href="/admin/login">Sign in with GitHub</a></p>
`;
  return layout({ title: 'Admin', body });
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().slice(0, 10);
}

function isExpired(rec: CapabilityRecord): boolean {
  return Date.parse(rec.expires_at) <= Date.now();
}

export interface DashboardOpts {
  login: string;
  csrf: string;
  workerOrigin: string;
  links: CapabilityRecord[];
  submissions: PullRequest[];
  audit: AuditEntry[];
  /** A just-created link to show once (full URL). */
  newLinkUrl?: string;
  notice?: string;
}

export function dashboard(o: DashboardOpts): string {
  const scopeOptions = SCOPES.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('');

  const newLink = o.newLinkUrl
    ? `<div class="notice ok"><strong>New link created.</strong> Copy it now — it is shown only once.
       Send it privately to the one person who should use it.<br><br>
       <code>${esc(o.newLinkUrl)}</code></div>`
    : '';

  const linkRows =
    o.links.length === 0
      ? `<tr><td colspan="6" class="muted">No links yet.</td></tr>`
      : o.links
          .map((r) => {
            const expired = isExpired(r);
            const state = r.revoked
              ? `<span class="tag revoked">revoked</span>`
              : expired
                ? `<span class="tag revoked">expired</span>`
                : `<span class="tag">active</span>`;
            const revokeBtn =
              r.revoked || expired
                ? ''
                : `<form method="post" action="/admin/links/${esc(r.id)}/revoke" style="margin:0">
                     <input type="hidden" name="csrf" value="${esc(o.csrf)}">
                     <button class="secondary" type="submit">Revoke</button>
                   </form>`;
            return `<tr>
              <td>${esc(r.label)}</td>
              <td><code>${esc(r.scope)}</code></td>
              <td>${esc(fmtDate(r.expires_at))}</td>
              <td>${r.use_count}${r.max_uses ? ' / ' + r.max_uses : ''}</td>
              <td>${state}</td>
              <td>${revokeBtn}</td>
            </tr>`;
          })
          .join('');

  const subRows =
    o.submissions.length === 0
      ? `<tr><td colspan="3" class="muted">No open submissions.</td></tr>`
      : o.submissions
          .map(
            (p) => `<tr>
              <td><a href="${esc(p.html_url)}" target="_blank" rel="noopener">${esc(p.title)}</a></td>
              <td><code>${esc(p.head.ref)}</code></td>
              <td>${esc(fmtDate(p.created_at))}</td>
            </tr>`,
          )
          .join('');

  const auditRows =
    o.audit.length === 0
      ? `<tr><td colspan="4" class="muted">No activity yet.</td></tr>`
      : o.audit
          .slice(0, 25)
          .map(
            (a) => `<tr>
              <td>${esc(fmtDate(a.ts))}</td>
              <td>${esc(a.action)}</td>
              <td>${esc(a.target ?? '')}</td>
              <td>${esc(a.result)}</td>
            </tr>`,
          )
          .join('');

  const body = `
<div class="row" style="justify-content:space-between">
  <h1 style="margin:0">Admin</h1>
  <span class="muted">${esc(o.login)} &middot; <a href="/admin/logout">sign out</a></span>
</div>
${o.notice ? `<div class="notice ok">${esc(o.notice)}</div>` : ''}
${newLink}

<h2>Create an edit link</h2>
<form method="post" action="/admin/links" class="card">
  <input type="hidden" name="csrf" value="${esc(o.csrf)}">
  <label for="label">Who is this for? <span class="help" style="display:inline">(private note, never published)</span></label>
  <input type="text" id="label" name="label" placeholder="e.g. events volunteer" required>
  <label for="scope">Scope</label>
  <select id="scope" name="scope">${scopeOptions}</select>
  <div class="row" style="gap:1rem">
    <div style="flex:1">
      <label for="days">Expires in (days)</label>
      <input type="text" id="days" name="days" value="30" inputmode="numeric">
    </div>
    <div style="flex:1">
      <label for="max_uses">Max uses <span class="help" style="display:inline">(0 = unlimited)</span></label>
      <input type="text" id="max_uses" name="max_uses" value="0" inputmode="numeric">
    </div>
  </div>
  <div style="margin-top:1.25rem"><button type="submit">Create link</button></div>
</form>

<h2>Active links</h2>
<table>
  <thead><tr><th>For</th><th>Scope</th><th>Expires</th><th>Uses</th><th>State</th><th></th></tr></thead>
  <tbody>${linkRows}</tbody>
</table>

<h2>Open submissions</h2>
<table>
  <thead><tr><th>Title</th><th>Branch</th><th>Opened</th></tr></thead>
  <tbody>${subRows}</tbody>
</table>

<h2>Recent activity</h2>
<table>
  <thead><tr><th>When</th><th>Action</th><th>Target</th><th>Result</th></tr></thead>
  <tbody>${auditRows}</tbody>
</table>
`;
  return layout({ title: 'Admin', body });
}
