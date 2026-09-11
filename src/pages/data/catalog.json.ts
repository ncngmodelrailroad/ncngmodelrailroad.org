import type { APIRoute } from 'astro';
import { z } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contentUse } from '../../config/contentUse';
import { contentFeeds, mapDataContext, mapDatasets } from '../../config/data';
import { donationEmailHref, organization } from '../../config/organization';
import { dataSnapshot, jsonResponse, publicDataUrl } from '../../utils/data';

const featureCollection = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(z.object({
    type: z.literal('Feature'),
    geometry: z.object({
      type: z.enum(['Point', 'LineString', 'Polygon']),
    }),
  })),
});

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => publicDataUrl(path, site);
  return jsonResponse({
    ...dataSnapshot(site),
    name: `${organization.name} public data catalog`,
    description: 'Downloadable historical map data and content feeds. No JavaScript, account, or API key is required.',
    llmsUrl: url('/llms.txt'),
    organization: {
      name: organization.fullName,
      url: url('/'),
      irsName: organization.nonprofit.irsName,
      ein: organization.nonprofit.ein,
      classification: organization.nonprofit.classification,
      nonprofitStatus: organization.nonprofit.schemaStatus,
      deductibilityStatement: organization.nonprofit.deductibilityStatement,
      sourceUrl: organization.nonprofit.sourceUrl,
      sourcePublishedOn: organization.nonprofit.sourcePublishedOn,
    },
    donations: {
      url: url(organization.donations.path),
      method: organization.donations.method,
      instructions: organization.donations.instructions,
      contactEmail: organization.contact.email,
      emailUrl: donationEmailHref,
    },
    usage: {
      advisory: true,
      summary: contentUse.summary,
      requests: contentUse.requests,
      rights: contentUse.rights,
      support: {
        title: contentUse.support.title,
        text: contentUse.support.text,
        links: contentUse.support.links.map((link) => ({
          label: link.label,
          url: url(link.path),
        })),
      },
      contactUrl: url('/contact'),
    },
    feedFormat: {
      schemaVersion: 'number: Catalog and content-feed contract version. Raw GeoJSON retains its source format.',
      generatedAt: 'string: ISO 8601 build timestamp, not a source verification date.',
      catalogUrl: 'string: Absolute URL of this catalog.',
      usagePolicyUrl: 'string: Content-use guidance and optional support, not a new reuse license.',
      snapshotNote: 'string: Static-snapshot freshness caveat.',
      id: 'string: Feed identifier.',
      name: 'string: Feed title.',
      description: 'string: Feed scope.',
      url: 'string: Absolute feed URL.',
      sourcePageUrl: 'string: Corresponding public page, which may include information beyond this feed.',
      caveats: 'array of strings: Interpretation limits.',
      timeZone: 'string, events only: IANA venue time zone for calendar-date comparisons.',
      items: 'array: Entries described by each dataset fields object.',
    },
    datasets: [
      ...mapDatasets.map((dataset) => {
        const data = featureCollection.parse(JSON.parse(
          readFileSync(join(process.cwd(), 'public', dataset.path), 'utf8'),
        ));
        return {
          id: dataset.id,
          name: dataset.name,
          description: dataset.description,
          url: url(dataset.path),
          sourcePageUrl: url('/map/'),
          format: 'GeoJSON',
          mediaType: 'application/geo+json',
          featureCount: data.features.length,
          geometryTypes: [...new Set(data.features.map((feature) => feature.geometry.type))].sort(),
          ...mapDataContext,
        };
      }),
      ...Object.entries(contentFeeds).map(([id, definition]) => ({
        id,
        name: definition.name,
        description: definition.description,
        url: url(definition.path),
        sourcePageUrl: url(definition.page),
        format: 'JSON',
        mediaType: 'application/json',
        caveats: definition.caveats,
        fields: definition.fields,
      })),
    ],
  });
};
