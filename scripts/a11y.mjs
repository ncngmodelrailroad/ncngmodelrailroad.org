/**
 * Accessibility gate: serves the built site and runs axe-core (WCAG 2.1 A/AA)
 * against every built content page, in both light and dark color schemes. Exits
 * non-zero if any page has violations or fails to load. Also checks outline
 * button hover contrast, short-screen navigation, long-link reflow, and browser
 * regressions for map controls and event dates.
 *
 * Redirect stubs (e.g. the Pages CMS `/admin` shortcut) are skipped
 * automatically.
 *
 * Requires `playwright` and `@axe-core/playwright` plus a Chromium browser.
 * CI installs pinned versions in .github/workflows/a11y.yml. Run `npm run build`
 * first. Locally: `npm i --no-save playwright @axe-core/playwright && npx
 * playwright install chromium`, then `npm run a11y`.
 * Use `node scripts/a11y.mjs --interactions-only` for just browser regressions.
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
  const options = { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] };
  // CI installs Playwright's Chromium; locally fall back to system Chrome.
  try {
    return await chromium.launch(options);
  } catch {
    return await chromium.launch({ ...options, channel: 'chrome' });
  }
}

const { chromium } = await import('playwright');
const { AxeBuilder } = await import('@axe-core/playwright');

async function localContext(browser, options = {}) {
  const context = await browser.newContext({
    colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block', ...options,
  });
  // Exercise the real bundled map and local GeoJSON, never live tiles, fonts,
  // analytics, or historical photographs. Tile appearance is not covered.
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === BASE ? route.continue() : route.abort());
  context.setDefaultTimeout(15000);
  return context;
}

async function checkMap(browser, scheme) {
  const context = await localContext(browser, { colorScheme: scheme });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(`${BASE}/map/?comparison=64`, { waitUntil: 'load' });
    await page.waitForFunction(() =>
      document.querySelector('[data-layer="route"]')?.disabled === false);
    assert.ok(await page.locator('#error').isHidden(), 'Map must initialize with local data');

    const slider = page.getByRole('slider', { name: 'Historical and modern map comparison' });
    assert.equal(await slider.getAttribute('aria-valuenow'), '64');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await slider.getAttribute('aria-valuenow'), '66');
    await page.keyboard.press('Home');
    assert.equal(await slider.getAttribute('aria-valuenow'), '0');
    await page.keyboard.press('End');
    assert.equal(await slider.getAttribute('aria-valuenow'), '100');
    assert.equal(await page.locator('#then-shell').evaluate((element) => element.style.width), '100%');

    await page.locator('#search-open').click();
    await page.locator('#search-input').fill('zzzz-no-such-railroad-feature');
    assert.match(await page.locator('#search-results').innerText(), /No matching map features/);
    await page.keyboard.press('Escape');
    assert.ok(await page.locator('#map-search').isHidden());
    assert.ok(await page.locator('#search-open').evaluate((element) => element === document.activeElement));
    await page.keyboard.press('/');
    await page.locator('#search-input').fill('Grass Valley');
    await page.locator('#search-results [role="option"]').first().waitFor();
    const previousSelection = await page.locator('#search-input').getAttribute('aria-activedescendant');
    await page.keyboard.press('ArrowDown');
    const selected = await page.locator('#search-input').getAttribute('aria-activedescendant');
    assert.ok(selected && selected !== previousSelection, 'ArrowDown must move the active search result');
    assert.equal(await page.locator(`#${selected}`).getAttribute('aria-selected'), 'true');
    const title = await page.locator(`#${selected} .search-result-title`).innerText();
    await page.keyboard.press('Enter');
    await page.locator('.maplibregl-popup').waitFor();
    assert.ok(await page.locator('#map-search').isHidden());
    assert.ok((await page.locator('.maplibregl-popup').innerText()).includes(title));
    const linkedUrl = page.url();
    assert.ok(new URL(linkedUrl).searchParams.get('feature'), 'Search selection must create a direct link');
    await page.goto(linkedUrl);
    await page.locator('.maplibregl-popup').waitFor();
    assert.ok((await page.locator('.maplibregl-popup').innerText()).includes(title),
      'Reloading a direct link must restore feature details');
    await page.getByRole('button', { name: 'Close map feature details' }).click();
    assert.equal(new URL(page.url()).searchParams.get('feature'), null);

    await page.locator('#brand-toggle').click();
    await page.locator('#tour-select').selectOption('route');
    await page.locator('#start-tour').click();
    await page.locator('#tour-card').waitFor();
    assert.match(await page.locator('#tour-progress').innerText(), /1 \//);
    assert.ok(await page.locator('#tour-prev').isDisabled());
    const firstTitle = await page.locator('#tour-title').innerText();
    assert.ok(firstTitle.trim(), 'Tour must have a named first stop');
    await page.locator('#tour-next').click();
    assert.match(await page.locator('#tour-progress').innerText(), /2 \//);
    await page.locator('#tour-prev').click();
    assert.equal(await page.locator('#tour-title').innerText(), firstTitle);
    await page.keyboard.press('Escape');
    assert.ok(await page.locator('#tour-card').isHidden());
    assert.ok(await page.locator('#brand-toggle').evaluate((element) => element === document.activeElement),
      'Closing the tour must return focus to its visible guide disclosure');
    await page.locator('#brand-toggle').click();
    await page.locator('#start-tour').click();
    await page.locator('#tour-close').click();
    assert.ok(await page.locator('#tour-card').isHidden());

    await page.locator('#panel-toggle').click();
    const route = page.locator('[data-layer="route"]');
    await route.uncheck();
    assert.equal(await route.isChecked(), false);
    await route.check();
    assert.equal(await route.isChecked(), true);
    const parcels = page.locator('[data-layer="parcels"]');
    const count = page.locator('.layer-row', { has: parcels }).locator('.layer-count');
    const dataLoaded = page.waitForResponse((response) =>
      response.url().includes('transit_right_of_way_candidate_parcels') && response.ok());
    await parcels.check();
    await dataLoaded;
    await page.waitForFunction(() => {
      const input = document.querySelector('[data-layer="parcels"]');
      const count = input?.closest('.layer-row').querySelector('.layer-count');
      return input && !input.disabled && /^\d+$/.test(count?.textContent ?? '');
    });
    assert.ok(Number(await count.innerText()) > 0, 'Optional layer must load a real local dataset');
    await parcels.uncheck();
    assert.equal(await parcels.isChecked(), false);

    // Replace only the OS share boundary, not the app's URL serialization.
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async ({ url }) => { window.__sharedMapUrl = url; },
      });
    });
    await slider.focus();
    await page.keyboard.press('End');
    await page.locator('.share-download summary').click();
    await page.locator('#share-view').click();
    const sharedUrl = await page.evaluate(() => window.__sharedMapUrl);
    const params = new URL(sharedUrl).searchParams;
    assert.equal(Number(params.get('comparison')), 100);
    assert.match(params.get('center') ?? '', /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/);
    for (const key of ['zoom', 'bearing', 'pitch']) {
      assert.ok(params.has(key) && Number.isFinite(Number(params.get(key))), `Shared view needs ${key}`);
    }
    await page.goto(sharedUrl);
    await page.waitForFunction(() =>
      document.querySelector('[data-layer="route"]')?.disabled === false);
    assert.equal(await slider.getAttribute('aria-valuenow'), '100',
      'Opening a shared view must restore the comparison slider');
    assert.deepEqual(errors, [], 'Map interactions must not throw browser errors');
  } finally {
    await context.close();
  }
}

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

async function checkEventDates(browser) {
  const feed = JSON.parse(await readFile(join(DIST, 'data/events.json'), 'utf8'));
  const context = await localContext(browser, { timezoneId: 'America/Los_Angeles' });
  const page = await context.newPage();
  const fullDate = (day) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
  const range = (start, end) => fullDate(start) + (end && end !== start ? ` - ${fullDate(end)}` : '');
  const midnight = (day) => {
    // Pacific DST transitions occur after midnight. UTC midnight still has the
    // offset that applies at the start of this venue calendar day.
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: feed.timeZone, timeZoneName: 'shortOffset',
    }).formatToParts(new Date(`${day}T00:00:00Z`)).find((part) => part.type === 'timeZoneName').value;
    return Date.parse(`${day}T00:00:00Z`) - Number(offset.replace('GMT', '')) * 3600000;
  };
  try {
    await page.goto(`${BASE}/events/`);
    const past = page.locator('details[data-past-events]');
    if (await past.count()) await past.locator('summary').click();
    for (const event of feed.items) {
      const article = page.locator(`[id="event-${event.id}"]`);
      assert.equal(normalizeText(await article.locator('h2').first().innerText()), event.title);
      const host = article.locator('p').filter({ hasText: /^\s*Host event/ });
      assert.ok(normalizeText(await host.innerText()).endsWith(range(event.date, event.endDate)),
        `${event.id}: host dates must remain calendar dates, without a timezone shift`);
      const layout = article.locator('p').filter({ hasText: /^\s*Layout (open|dates):/ });
      if (event.layoutStartDate) {
        assert.ok(normalizeText(await layout.innerText()).endsWith(range(event.layoutStartDate, event.layoutEndDate)),
          `${event.id}: confirmed layout dates must stay separate from host dates`);
      } else {
        assert.equal(await layout.count(), 0, `${event.id}: do not infer confirmed layout dates`);
      }
    }

    for (const confirmed of [false, true]) {
      const event = feed.items.find((item) => Boolean(item.layoutStartDate) === confirmed);
      if (!event) {
        console.log(`  skip  ${confirmed ? 'confirmed' : 'unconfirmed'} event day-boundary check (no matching event)`);
        continue;
      }
      const start = event.layoutStartDate ?? event.date;
      const end = event.layoutStartDate ? event.layoutEndDate ?? start : event.endDate ?? start;
      const nextDay = new Date(Date.parse(`${end}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
      const stop = page.locator(`[data-stop-id="${event.id}"]`);
      for (const [instant, state] of [
        [midnight(start), 'now'],
        [midnight(nextDay) - 1, 'now'],
        [midnight(nextDay), 'past'],
      ]) {
        await page.clock.setFixedTime(new Date(instant));
        await page.goto(`${BASE}/events/`);
        await page.waitForFunction(({ id, state }) =>
          document.querySelector(`[data-stop-id="${id}"]`)?.dataset.state === state, { id: event.id, state });
        const label = await stop.locator('[data-state-label]').textContent();
        assert.equal(label, state === 'past' ? 'Departed' : confirmed ? 'Layout open' : 'Host event on now');
      }
      if (event.layoutStartDate && event.date < event.layoutStartDate) {
        await page.clock.setFixedTime(new Date(midnight(event.date)));
        await page.goto(`${BASE}/events/`);
        await page.waitForFunction((id) =>
          document.querySelector(`[data-stop-id="${id}"]`)?.dataset.state === 'next', event.id);
      }
    }
    const firstPastEvent = page.locator('details[data-past-events] article').first();
    if (await firstPastEvent.count()) {
      const pastId = await firstPastEvent.getAttribute('id');
      await page.goto(`${BASE}/events/#${pastId}`);
      await page.locator(`[id="${pastId}"]`).waitFor();
      assert.ok(await past.evaluate((element) => element.open), 'A direct event link must reveal its past listing');
    } else {
      console.log('  skip  past event deep-link check (no past events)');
    }
  } finally {
    await context.close();
  }
}

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
const pages = process.argv.includes('--interactions-only') ? [] : (await discoverPages()).sort();
const browser = await launchBrowser(chromium);

let total = 0;
const byRule = {};
console.log(`Auditing ${pages.length} pages (${SCHEMES.join(', ')})...\n`);

for (const scheme of SCHEMES) {
  const context = await localContext(browser, { colorScheme: scheme });
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

for (const [name, check] of [
  ...SCHEMES.map((scheme) => [`${scheme} map interactions`, () => checkMap(browser, scheme)]),
  ['event dates and Pacific day boundaries', () => checkEventDates(browser)],
]) {
  try {
    await check();
    console.log(`  ok   ${name}`);
  } catch (error) {
    total += 1;
    console.log(`  FAIL ${name}\n${error.stack}`);
  }
}

await browser.close();
server.close();

console.log('');
if (total === 0) {
  console.log(`PASS - 0 WCAG 2.1 AA violations across ${pages.length} pages; browser regressions passed.`);
} else {
  console.log(`FAIL - ${total} issue(s):`, byRule);
  process.exit(1);
}
