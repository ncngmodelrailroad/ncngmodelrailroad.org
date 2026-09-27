/** Editor page: the no-account form a capability link opens. */
import { EVENT_FIELDS, type FieldDef } from '../content/events';
import { esc, layout } from './layout';

function field(f: FieldDef): string {
  const id = `f_${f.name}`;
  const req = f.required ? ' <span aria-hidden="true" style="color:#b3261e">*</span>' : '';
  const help = f.help ? `<div class="help">${esc(f.help)}</div>` : '';
  if (f.type === 'checkbox') {
    return `<div class="row" style="margin-top:1rem"><input type="checkbox" id="${id}" name="${f.name}"><label for="${id}" style="margin:0">${esc(
      f.label,
    )}</label></div>${help}`;
  }
  let control: string;
  if (f.type === 'textarea' || f.type === 'markdown') {
    control = `<textarea id="${id}" name="${f.name}"${f.type === 'markdown' ? ' style="min-height:14rem"' : ''}></textarea>`;
  } else {
    control = `<input type="${f.type}" id="${id}" name="${f.name}">`;
  }
  return `<label for="${id}">${esc(f.label)}${req}</label>${help}${control}`;
}

export function editorPage(nonce: string): string {
  const fields = EVENT_FIELDS.map(field).join('\n');
  const body = `
<h1>Edit events</h1>
<p class="muted">Add a new event or update an existing one. When you submit, your
change is sent in for review and goes live once a maintainer approves it. You do
not need an account.</p>

<div id="status" class="notice hidden"></div>

<div id="editor" class="hidden">
  <div class="card">
    <label for="existing">Start from</label>
    <select id="existing"><option value="">New event</option></select>
  </div>

  <form id="form" class="card" autocomplete="off">
    <input type="hidden" id="mode" value="create">
    <input type="hidden" id="path" value="">
    <input type="hidden" id="sha" value="">
    ${fields}
    <div style="margin-top:1.5rem" class="row">
      <button type="submit" id="submit">Submit for review</button>
      <span id="busy" class="muted hidden">Sending…</span>
    </div>
  </form>
</div>

<div id="done" class="hidden"></div>
`;

  const script = `
const token = (location.hash.match(/(?:^#|&)t=([^&]+)/) || [])[1] || '';
history.replaceState(null, '', location.pathname);
const $ = (id) => document.getElementById(id);
const FIELDS = ${JSON.stringify(EVENT_FIELDS.map((f) => ({ name: f.name, type: f.type })))};
let events = [];

function status(msg, kind) {
  const el = $('status');
  el.textContent = msg;
  el.className = 'notice ' + (kind || 'err');
  el.classList.remove('hidden');
}
async function api(path, payload) {
  return fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ token }, payload)),
  });
}
function setForm(input) {
  for (const f of FIELDS) {
    const el = $('f_' + f.name);
    if (!el) continue;
    if (f.type === 'checkbox') el.checked = !!(input && input[f.name]);
    else el.value = (input && input[f.name] != null) ? input[f.name] : '';
  }
}
function gather() {
  const out = {};
  for (const f of FIELDS) {
    const el = $('f_' + f.name);
    out[f.name] = f.type === 'checkbox' ? el.checked : el.value;
  }
  return out;
}

async function load() {
  if (!token) { status('This editor link is missing its access token. Ask for a fresh link.'); return; }
  let r;
  try { r = await api('/edit/load', {}); }
  catch (e) { status('Network error. Try again.'); return; }
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    status(e.error || 'This link is not valid or has expired. Ask for a fresh link.');
    return;
  }
  const data = await r.json();
  events = data.events || [];
  const sel = $('existing');
  for (const ev of events) {
    const o = document.createElement('option');
    o.value = ev.path; o.textContent = ev.title || ev.path;
    sel.appendChild(o);
  }
  $('editor').classList.remove('hidden');
}

document.addEventListener('change', (e) => {
  if (e.target && e.target.id === 'existing') {
    const path = e.target.value;
    if (!path) { $('mode').value = 'create'; $('path').value = ''; $('sha').value = ''; setForm(null); return; }
    const ev = events.find((x) => x.path === path);
    if (ev) { $('mode').value = 'update'; $('path').value = ev.path; $('sha').value = ev.sha || ''; setForm(ev.input); }
  }
});

document.addEventListener('submit', async (e) => {
  e.preventDefault();
  $('submit').disabled = true; $('busy').classList.remove('hidden'); $('status').classList.add('hidden');
  const payload = Object.assign({ mode: $('mode').value, path: $('path').value, sha: $('sha').value }, gather());
  let r;
  try { r = await api('/edit/submit', payload); }
  catch (err) { status('Network error. Try again.'); $('submit').disabled = false; $('busy').classList.add('hidden'); return; }
  $('busy').classList.add('hidden');
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    status((data.errors && data.errors.join(' ')) || data.error || 'Could not submit. Check the fields and try again.');
    $('submit').disabled = false;
    return;
  }
  $('editor').classList.add('hidden');
  const done = $('done');
  done.className = 'notice ok';
  done.innerHTML = 'Thank you. Your change was sent in for review. A maintainer will look it over and publish it.' +
    (data.prUrl ? ' <a href="' + data.prUrl + '" target="_blank" rel="noopener">View the request</a>.' : '');
  done.classList.remove('hidden');
});

load();
`;

  return layout({
    title: 'Content editor',
    headTitle: 'Edit events',
    body: body + `\n<script nonce="${nonce}">${script}</script>`,
    nonce,
  });
}
