/**
 * Accessibility gate: serves the built site and runs axe-core (WCAG 2.1 A/AA)
 * against every built content page, in both light and dark color schemes. Exits
 * non-zero if any page has violations or fails to load. Also checks outline
 * button hover contrast, short-screen navigation, and long-link reflow.
 *
 * Redirect stubs (e.g. the Pages CMS `/admin` shortcut) are skipped
 * automatically.
 *
 * Requires `playwright` and `@axe-core/playwright` plus a Chromium browser.
 * CI installs pinned versions in .github/workflows/a11y.yml. Run `npm run build`
 * first. Locally: `npm i --no-save playwright @axe-core/playwright && npx
 * playwright install chromium`, then `npm run a11y`.
 */
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = 8080;
const BASE = `http://localhost:${PORT}`;
const SCHEMES = ['light', 'dark'];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

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

/**
 * Discover every built content page from dist. Each route is a
 * `<dir>/index.html`. Redirect stubs (pages with a meta refresh) are skipped so
 * the audit only runs against real, viewable content.
 */
async function discoverPages(dir = DIST, base = '') {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === '_astro') continue;
      out.push(...(await discoverPages(join(dir, entry.name), `${base}/${entry.name}`)));
    } else if (entry.name === 'index.html') {
      const html = await readFile(join(dir, entry.name), 'utf8');
      if (/http-equiv=["']?refresh/i.test(html)) continue;
      out.push(`${base}/`);
    }
  }
  return out;
}

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  for (const candidate of [join(DIST, clean), join(DIST, clean, 'index.html')]) {
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) return candidate;
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

async function auditResilience(page, path) {
  const violations = [];
  if (path === '/styleguide/') {
    for (const selector of ['main button.btn-outline', 'main button.btn-outline-inverse']) {
      const button = page.locator(selector);
      await button.hover();
      await button.evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
      });
      const result = await new AxeBuilder({ page }).include(selector).withTags(AXE_TAGS).analyze();
      violations.push(...result.violations.map((violation) => ({ ...violation, state: 'hover' })));
    }
  }

  if (path === '/') {
    for (const viewport of [{ width: 390, height: 667 }, { width: 667, height: 390 }]) {
      await page.setViewportSize(viewport);
      const toggle = page.locator('#mobile-menu-btn');
      const menu = page.locator('#mobile-menu');
      await toggle.click();
      await toggle.focus();
      const links = menu.locator('a');
      for (let index = 0; index < await links.count(); index += 1) {
        await page.keyboard.press('Tab');
      }
      const last = links.last();
      assert.ok(await last.evaluate((element) => element === document.activeElement),
        'Mobile navigation must allow tabbing to its final link');
      const rect = await last.boundingBox();
      assert.ok(rect && rect.y >= 0 && rect.y + rect.height <= viewport.height,
        `Mobile navigation must reveal its final link at ${viewport.width}x${viewport.height}`);
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.ok(await toggle.evaluate((element) => element === document.activeElement),
        'Closing mobile navigation must return focus to its toggle');

      await toggle.click();
      await menu.evaluate((element) => { element.scrollTop = element.scrollHeight; });
      assert.ok(await last.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return element.contains(document.elementFromPoint(
          bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
      }), 'Mobile navigation must allow pointing to its final link after scrolling');
      await page.keyboard.press('Escape');
    }
  }

  if (path === '/events/') {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    const fitsViewport = () => page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth);
    assert.ok(await fitsViewport(), 'Event content must reflow at 320px');
    await page.locator('main .page-container.max-w-4xl').first().evaluate((container) => {
      const content = document.createElement('div');
      content.className = 'prose prose-sm';
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = 'Railroad'.repeat(40);
      content.append(link);
      container.append(content);
    });
    assert.ok(await fitsViewport(), 'Unbroken event links must not widen the page');
  }
  return violations;
}

/** Audit one page once on a fresh page. Returns a load error or violations. */
async function auditOnce(context, path) {
  const page = await context.newPage();
  try {
    const response = await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    if (!response || !response.ok()) {
      return { loadError: `HTTP ${response?.status() ?? 'none'}` };
    }
    await page.waitForLoadState('domcontentloaded');
    const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    violations.push(...await auditResilience(page, path));
    return { violations };
  } finally {
    await page.close().catch(() => {});
  }
}

/** axe's evaluate can intermittently lose its execution context; retry once. */
async function audit(context, path) {
  try {
    return await auditOnce(context, path);
  } catch {
    try {
      return await auditOnce(context, path);
    } catch (err) {
      return { crash: err.message.split('\n')[0] };
    }
  }
}

const server = await startServer();
const pages = (await discoverPages()).sort();
const browser = await launchBrowser(chromium);

let total = 0;
const byRule = {};
console.log(`Auditing ${pages.length} pages (${SCHEMES.join(', ')})...\n`);

for (const scheme of SCHEMES) {
  const context = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' });
  for (const path of pages) {
    const result = await audit(context, path);
    if (result.loadError) {
      console.log(`  FAIL ${scheme} ${path} - did not load (${result.loadError})`);
      total += 1;
    } else if (result.crash) {
      console.log(`  FAIL ${scheme} ${path} - audit error: ${result.crash}`);
      total += 1;
    } else {
      const count = result.violations.reduce((sum, v) => sum + v.nodes.length, 0);
      total += count;
      if (count === 0) {
        console.log(`  ok   ${scheme} ${path}`);
      } else {
        console.log(`  FAIL ${scheme} ${path} - ${count} violation(s)`);
        for (const v of result.violations) {
          byRule[v.id] = (byRule[v.id] ?? 0) + v.nodes.length;
          for (const node of v.nodes) {
            console.log(`       [${v.impact}] ${v.id}${v.state ? ` (${v.state})` : ''}: ${node.target.join(' ')}`);
          }
        }
      }
    }
  }
  await context.close();
}

await browser.close();
server.close();

console.log('');
if (total === 0) {
  console.log(`PASS - 0 WCAG 2.1 AA violations across ${pages.length} pages.`);
} else {
  console.log(`FAIL - ${total} issue(s):`, byRule);
  process.exit(1);
}
