/**
 * Standalone map build. Run `npm run build:map` after editing src/map; production
 * builds and dev-server startup also run it. Use `--check` to detect stale output.
 *
 * src/map/app.js, bootstrap.js and styles.css were recovered from shipped bundles,
 * not original upstream source. Formatting and descriptive outer binding names
 * were recovered; some local names and minifier idioms remain. src/map/sw.js
 * preserves the shipped cache policy. The Astro page remains the HTML source.
 *
 * public/map/*.min.*, sw.js, extracted/asset-manifest.json and
 * src/map/generated-assets.json are generated and stay committed for static use.
 * Edit GeoJSON in public/map/extracted and paths in src/map/data-assets.json.
 * Builds refresh data hashes/counts, not the underlying records or their credits.
 * MapLibre, its license/origin record, posters and redirects are retained assets,
 * not reconstructed source, and are neither compiled nor downloaded here.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { transform } from 'esbuild';

const sourceRoot = new URL('../src/map/', import.meta.url);
const outputRoot = new URL('../public/map/', import.meta.url);
const check = process.argv.includes('--check');
const outputs = new Map();
const hash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 16);
const versioned = (path, content) => `${path}?v=${hash(content)}`;

for (const [source, output, loader] of [
  ['app.js', 'app.min.js', 'js'],
  ['bootstrap.js', 'bootstrap.min.js', 'js'],
  ['styles.css', 'styles.min.css', 'css'],
]) {
  const input = await readFile(new URL(source, sourceRoot), 'utf8');
  const { code } = await transform(input, {
    loader,
    minify: true,
    legalComments: 'none',
    charset: 'utf8',
  });
  outputs.set(new URL(output, outputRoot), code);
}

const assets = Object.fromEntries(
  [...outputs].map(([url, content]) => {
    const filename = url.pathname.split('/').pop();
    return [filename, versioned(filename, content)];
  }),
);
outputs.set(
  new URL('generated-assets.json', sourceRoot),
  `${JSON.stringify(assets, null, 2)}\n`,
);

const dataPaths = JSON.parse(await readFile(new URL('data-assets.json', sourceRoot), 'utf8'));
const dataManifest = {};
const counts = {};
for (const [key, path] of Object.entries(dataPaths)) {
  if (!/^extracted\/[a-z_]+\.geojson$/.test(path)) {
    throw new Error(`Unexpected map data path for ${key}: ${path}`);
  }
  const content = await readFile(new URL(path, outputRoot));
  const data = JSON.parse(content);
  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error(`Expected a GeoJSON FeatureCollection in ${path}`);
  }
  dataManifest[key] = versioned(path, content);
  counts[key] = data.features.length;
}
dataManifest.counts = counts;
outputs.set(
  new URL('extracted/asset-manifest.json', outputRoot),
  `${JSON.stringify(dataManifest)}\n`,
);

const workerSource = await readFile(new URL('sw.js', sourceRoot), 'utf8');
const shellAssets = ['styles.min.css', 'bootstrap.min.js', 'app.min.js'].map(
  (filename) => `./${assets[filename]}`,
);
const shellToken = '__MAP_SHELL_ASSETS__';
if (workerSource.split(shellToken).length !== 2) {
  throw new Error('Expected exactly one shell asset placeholder in src/map/sw.js');
}
outputs.set(
  new URL('sw.js', outputRoot),
  workerSource.replace(shellToken, JSON.stringify(shellAssets, null, 2)),
);

const stale = [];
for (const [path, content] of outputs) {
  const current = await readFile(path, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (current === content) continue;
  if (check) stale.push(path.pathname);
  else await writeFile(path, content);
}
if (stale.length) {
  throw new Error(`Stale map output. Run npm run build:map:\n${stale.join('\n')}`);
}
console.log(check ? 'Map build output is current.' : 'Built standalone map assets.');
