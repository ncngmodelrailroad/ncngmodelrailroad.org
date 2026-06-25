/** Shared HTML shell and escaping. Self-contained styles, brand-aligned. */

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const STYLES = `
:root{--primary:#8A1F17;--ink:#1a1a1a;--muted:#5c5c5c;--bg:#faf8f5;--card:#fff;--border:#e6e1da;--ok:#1f7a3d;--err:#b3261e}
*{box-sizing:border-box}
body{margin:0;font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--bg)}
header{background:var(--primary);color:#fff;padding:1rem 1.25rem}
header a{color:#fff;text-decoration:none}
header .title{font-weight:700;font-size:1.05rem}
main{max-width:760px;margin:0 auto;padding:1.5rem 1.25rem 4rem}
h1{font-size:1.5rem;margin:.2rem 0 1rem}
h2{font-size:1.15rem;margin:2rem 0 .75rem}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.25rem;margin:1rem 0}
label{display:block;font-weight:600;margin:1rem 0 .35rem}
.help{font-weight:400;color:var(--muted);font-size:.85rem;margin:.15rem 0 .35rem}
input[type=text],input[type=date],textarea,select{width:100%;padding:.6rem .7rem;border:1px solid var(--border);border-radius:8px;font:inherit;background:#fff}
textarea{min-height:8rem;resize:vertical}
.row{display:flex;gap:.5rem;align-items:center}
.row input[type=checkbox]{width:1.1rem;height:1.1rem}
button,.btn{display:inline-block;background:var(--primary);color:#fff;border:0;border-radius:8px;padding:.65rem 1.1rem;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}
button.secondary,.btn.secondary{background:#fff;color:var(--primary);border:1.5px solid var(--primary)}
button:disabled{opacity:.5;cursor:not-allowed}
.muted{color:var(--muted)}
.notice{padding:.8rem 1rem;border-radius:8px;margin:1rem 0}
.notice.ok{background:#e8f5ec;color:var(--ok);border:1px solid #bfe3ca}
.notice.err{background:#fdecea;color:var(--err);border:1px solid #f5c6c2}
.hidden{display:none}
table{width:100%;border-collapse:collapse;margin:.5rem 0}
th,td{text-align:left;padding:.5rem .4rem;border-bottom:1px solid var(--border);font-size:.92rem;vertical-align:top}
code{background:#f1ece5;padding:.1rem .35rem;border-radius:4px;font-size:.85em;word-break:break-all}
.tag{display:inline-block;font-size:.75rem;padding:.1rem .5rem;border-radius:999px;background:#f1ece5;color:var(--muted)}
.tag.revoked{background:#fdecea;color:var(--err)}
footer{max-width:760px;margin:0 auto;padding:1rem 1.25rem;color:var(--muted);font-size:.85rem}
`;

export interface LayoutOpts {
  title: string;
  body: string;
  /** CSP nonce for an inline script, if the page needs one. */
  nonce?: string;
  /** Header link target. */
  homeHref?: string;
  headTitle?: string;
}

export function layout(opts: LayoutOpts): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(opts.headTitle ?? opts.title)}</title>
<style>${STYLES}</style>
</head>
<body>
<header><a href="${esc(opts.homeHref ?? '/')}"><span class="title">${esc(
    opts.title,
  )}</span></a></header>
<main>${opts.body}</main>
<footer>Nevada County Narrow Gauge model railroad &middot; content editor</footer>
</body>
</html>`;
}
