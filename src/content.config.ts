import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    location: z.string(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
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
