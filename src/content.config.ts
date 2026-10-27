import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    layoutStartDate: z.date().nullish(),
    layoutEndDate: z.date().nullish(),
    location: z.string(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
  }).refine(event => !event.layoutEndDate || !!event.layoutStartDate, {
    path: ['layoutEndDate'],
    message: 'A layout end date requires a confirmed layout start date.',
  }).refine(event => !event.layoutStartDate || (
    event.layoutStartDate >= event.date &&
    (event.layoutEndDate ?? event.layoutStartDate) >= event.layoutStartDate &&
    (event.layoutEndDate ?? event.layoutStartDate) <= (event.endDate ?? event.date)
  ), {
    path: ['layoutStartDate'],
    message: 'Confirmed layout dates must be in order and within the host event dates.',
  }),
});

const board = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/board' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    image: z.string(),
    order: z.number(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    caption: z.string(),
    category: z.enum(['Historic', 'Layout', 'Volunteer Work', 'Fairgrounds & Events']),
    area: z.string().trim().nullish(),
  }),
});

const trains = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trains' }),
  schema: z.object({
    number: z.string(),
    name: z.string(),
    wheel: z.string(),
    source: z.string().optional(),
    rosterEntry: z.string().optional(),
    notes: z.string(),
    order: z.number(),
  }),
});

const learn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    icon: z.string().default('solar:book-bold'),
    updatedDate: z.date().optional(),
  }),
});

const glossary = defineCollection({
  loader: file('src/data/glossary.yaml'),
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    category: z.enum([
      'Scale & Gauge',
      'Trains & Equipment',
      'Building & Detailing',
      'Track & Operating',
    ]),
  }),
});

export const collections = { events, board, gallery, trains, learn, glossary };
