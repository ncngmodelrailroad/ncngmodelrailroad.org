import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { contentFeeds } from '../../config/data';
import { dataSnapshot, jsonResponse, publicDataUrl } from '../../utils/data';

export const getStaticPaths = (() =>
  Object.keys(contentFeeds).map((feed) => ({ params: { feed } }))
) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, site }) => {
  const id = params.feed;
  if (id !== 'events' && id !== 'trains' && id !== 'glossary') {
    throw new Error(`Unknown content data feed: ${id}`);
  }

  const definition = contentFeeds[id];
  const metadata = {
    ...dataSnapshot(site),
    id,
    name: definition.name,
    description: definition.description,
    url: publicDataUrl(definition.path, site),
    sourcePageUrl: publicDataUrl(definition.page, site),
    caveats: definition.caveats,
  };

  switch (id) {
    case 'events': {
      const entries = await getCollection('events');
      return jsonResponse({
        ...metadata,
        timeZone: contentFeeds.events.timeZone,
        items: entries
          .sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.id.localeCompare(b.id))
          .map(({ id, data }) => ({
            id,
            title: data.title,
            date: data.date.toISOString().split('T')[0],
            endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : null,
            layoutStartDate: data.layoutStartDate ? data.layoutStartDate.toISOString().split('T')[0] : null,
            layoutEndDate: data.layoutEndDate ? data.layoutEndDate.toISOString().split('T')[0] : null,
            location: data.location,
            description: data.description ?? null,
            featured: data.featured,
          })),
      });
    }
    case 'trains': {
      const entries = await getCollection('trains');
      return jsonResponse({
        ...metadata,
        items: entries
          .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
          .map(({ id, data }) => ({
            id,
            number: data.number,
            name: data.name,
            wheel: data.wheel,
            source: data.source ?? null,
            rosterEntry: data.rosterEntry ?? null,
            notes: data.notes,
            order: data.order,
          })),
      });
    }
    case 'glossary': {
      const entries = await getCollection('glossary');
      return jsonResponse({
        ...metadata,
        items: entries
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(({ id, data }) => ({
            id,
            term: data.term,
            definition: data.definition,
            category: data.category,
            url: publicDataUrl(`${definition.page}#${encodeURIComponent(id)}`, site),
          })),
      });
    }
  }
};
