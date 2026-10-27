import { contentUse } from '../config/contentUse';
import { dataCatalogPath, dataSchemaVersion, dataSnapshotCaveat } from '../config/data';

export function publicDataUrl(path: string, site: URL | undefined): string {
  if (!site) {
    throw new Error('The Astro site URL is required to generate public data links.');
  }
  return new URL(path, site).href;
}

export function dataSnapshot(site: URL | undefined) {
  return {
    schemaVersion: dataSchemaVersion,
    generatedAt: new Date().toISOString(),
    catalogUrl: publicDataUrl(dataCatalogPath, site),
    usagePolicyUrl: publicDataUrl(contentUse.path, site),
    snapshotNote: dataSnapshotCaveat,
  };
}

export function jsonResponse(data: unknown): Response {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
