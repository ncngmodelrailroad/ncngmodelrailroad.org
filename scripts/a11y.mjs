/**
 * Accessibility gate: serves the built site and runs axe-core (WCAG 2.1 A/AA)
 * against every page. Exits non-zero if any page has violations, so CI fails on
 * a regression.
 *
 * Requires `playwright` and `@axe-core/playwright` plus a Chromium browser.
 * CI installs them in .github/workflows/a11y.yml. Run `npm run build` first.
 * Locally: `npm i --no-save playwright @axe-core/playwright && npx playwright
 * install chromium`, then `npm run a11y`.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = 8080;
const BASE = `http://localhost:${PORT}`;

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

// Pages to audit (404 is intentionally excluded).
const PAGES = [
  '/',
  '/about/',
  '/board-members/',
  '/contact/',
  '/donate/',
  '/events/',
  '/gallery/',
  '/links/',
  '/trains/',
  '/volunteer/',
  '/learn/',
  '/learn/glossary/',
  '/learn/new-to-model-railroading/',
  '/privacy/',
  '/accessibility/',
  '/styleguide/',
];

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [join(DIST, clean), join(DIST, clean, 'index.html')];
  for (const candidate of candidates) {
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) return candidate;
    if (info?.isDirectory()) {
      const index = join(candidate, 'index.html');
      if (await stat(index).then((s) => s.isFile()).catch(() => false)) return index;
    }
  }
  return null;
}

function startServer() {
  const server = createServer(async (req, res) => {
    const file = await resolveFile(req.url);
    if (!file) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function launchBrowser(chromium) {
  // CI installs Playwright's Chromium; locally fall back to system Chrome.
  try {
    return await chromium.launch();
  } catch {
    return await chromium.launch({ channel: 'chrome' });
  }
}

const { chromium } = await import('playwright');
const { AxeBuilder } = await import('@axe-core/playwright');

const server = await startServer();
const browser = await launchBrowser(chromium);
const page = await (await browser.newContext()).newPage();

let total = 0;
const byRule = {};
for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const count = violations.reduce((sum, v) => sum + v.nodes.length, 0);
  total += count;
  if (count === 0) {
    console.log(`  ok   ${path}`);
  } else {
    console.log(`  FAIL ${path} - ${count} violation(s)`);
    for (const v of violations) {
      byRule[v.id] = (byRule[v.id] ?? 0) + v.nodes.length;
      for (const node of v.nodes) {
        console.log(`       [${v.impact}] ${v.id}: ${node.target.join(' ')}`);
      }
    }
  }
}

await browser.close();
server.close();

console.log('');
if (total === 0) {
  console.log(`PASS - 0 WCAG 2.1 AA violations across ${PAGES.length} pages.`);
} else {
  console.log(`FAIL - ${total} WCAG 2.1 AA violation(s):`, byRule);
  process.exit(1);
}
