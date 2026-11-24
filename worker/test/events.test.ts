import { describe, it, expect } from 'vitest';
import {
  eventPath,
  parseEvent,
  serializeEvent,
  slugify,
  validateEvent,
  type EventInput,
} from '../src/content/events';

const sample: EventInput = {
  title: 'Nevada County Fair 2026',
  date: '2026-08-13',
  endDate: '2026-08-17',
  location: 'Nevada County Fairgrounds, Grass Valley',
  description: 'Visit the model railroad during the fair.\nSecond line.',
  featured: true,
  body: '## Open House Hours\n\nHours vary.',
};

describe('events content type', () => {
  it('slugifies titles for filenames', () => {
    expect(slugify('Father’s Day Bluegrass!')).toBe('fathers-day-bluegrass');
    expect(eventPath(sample)).toBe('src/content/events/2026-08-13-nevada-county-fair-2026.md');
  });

  it('round-trips through serialize and parse', () => {
    const md = serializeEvent(sample);
    expect(md).toContain('title: "Nevada County Fair 2026"');
    expect(md).toContain('date: 2026-08-13');
    expect(md).toContain('featured: true');
    expect(md).toContain('description: |');

    const parsed = parseEvent(md);
    expect(parsed.title).toBe(sample.title);
    expect(parsed.date).toBe(sample.date);
    expect(parsed.endDate).toBe(sample.endDate);
    expect(parsed.location).toBe(sample.location);
    expect(parsed.description).toBe(sample.description);
    expect(parsed.featured).toBe(true);
    expect(parsed.body).toBe(sample.body);
  });

  it('validates required fields and dates', () => {
    expect(validateEvent(sample)).toEqual([]);
    expect(validateEvent({ ...sample, title: '' })).toContain('Title is required.');
    expect(validateEvent({ ...sample, date: '2026-13-99' })).toContain(
      'Start date must be a real date (YYYY-MM-DD).',
    );
    expect(validateEvent({ ...sample, endDate: '2026-08-01' })).toContain(
      'End date cannot be before the start date.',
    );
  });

  it('escapes quotes in string fields', () => {
    const md = serializeEvent({ ...sample, title: 'A "Big" Show', endDate: undefined });
    expect(md).toContain('title: "A \\"Big\\" Show"');
    expect(parseEvent(md).title).toBe('A "Big" Show');
  });

  it('rejects HTML and control characters in fields', () => {
    expect(validateEvent({ ...sample, title: 'Hi <script>' })).toContain(
      'Title cannot contain "<" or ">".',
    );
    expect(validateEvent({ ...sample, location: 'A<b' })).toContain(
      'Location cannot contain "<" or ">".',
    );
    expect(validateEvent({ ...sample, title: 'Line\nbreak' })).toContain(
      'Title cannot contain line breaks or control characters.',
    );
  });

  it('contains a lone carriage return inside the description block', () => {
    const md = serializeEvent({
      ...sample,
      description: 'first line\rinjected: PWNED',
      endDate: undefined,
    });
    const frontmatter = md.slice(0, md.indexOf('\n---', 4));
    // The injected text must stay indented inside the block scalar, never a
    // top-level key at column 0.
    expect(frontmatter).not.toMatch(/^injected:/m);
    expect(md).toContain('  injected: PWNED');
  });
});
