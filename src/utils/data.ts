import { contentUse } from '../config/contentUse';
import { dataCatalogPath, dataSchemaVersion, dataSnapshotCaveat } from '../config/data';

/** Resolves a public data path against Astro's site URL. Throws if the URL is unset. */
export function publicDataUrl(path: string, site: URL | undefined): string {
  if (!site) {
    throw new Error('The Astro site URL is required to generate public data links.');
  }
  return new URL(path, site).href;
}

/** Builds shared snapshot metadata for generated data feeds. */
export function dataSnapshot(site: URL | undefined) {
  return {
    schemaVersion: dataSchemaVersion,
    generatedAt: new Date().toISOString(),
    catalogUrl: publicDataUrl(dataCatalogPath, site),
    usagePolicyUrl: publicDataUrl(contentUse.path, site),
    snapshotNote: dataSnapshotCaveat,
  };
}

/** Serializes data as indented JSON with a UTF-8 content type and trailing newline. */
export function jsonResponse(data: unknown): Response {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
