/**
 * The "events" content type. Mirrors the schema in ../../../src/content.config.ts
 * (title, date, endDate, location, description, featured + Markdown body) and
 * the .pages.yml filename pattern `{year}-{month}-{day}-{slug}.md`.
 */

export interface EventInput {
  title: string;
  /** yyyy-mm-dd */
  date: string;
  /** yyyy-mm-dd */
  endDate?: string;
  location: string;
  description?: string;
  featured: boolean;
  body: string;
}

export interface FieldDef {
  name: keyof EventInput;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'checkbox' | 'markdown';
  required: boolean;
  help?: string;
}

export const EVENT_FIELDS: FieldDef[] = [
  { name: 'title', label: 'Event title', type: 'text', required: true },
  { name: 'date', label: 'Start date', type: 'date', required: true },
  { name: 'endDate', label: 'End date', type: 'date', required: false, help: 'Leave blank for a single-day event.' },
  { name: 'location', label: 'Location', type: 'text', required: true },
  {
    name: 'description',
    label: 'Short description',
    type: 'textarea',
    required: false,
    help: 'One or two sentences shown in event listings.',
  },
  { name: 'featured', label: 'Feature on the homepage', type: 'checkbox', required: false },
  {
    name: 'body',
    label: 'Details',
    type: 'markdown',
    required: false,
    help: 'The full event description. Markdown is supported.',
  },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export const FIELD_LIMITS = {
  title: 200,
  location: 200,
  description: 2000,
  body: 50000,
} as const;

export function validateEvent(input: EventInput): string[] {
  const errors: string[] = [];
  if (!input.title?.trim()) errors.push('Title is required.');
  else if (input.title.length > FIELD_LIMITS.title)
    errors.push(`Title must be ${FIELD_LIMITS.title} characters or fewer.`);
  if (!input.date?.trim()) errors.push('Start date is required.');
  else if (!isValidDate(input.date)) errors.push('Start date must be a real date (YYYY-MM-DD).');
  if (input.endDate?.trim()) {
    if (!isValidDate(input.endDate)) errors.push('End date must be a real date (YYYY-MM-DD).');
    else if (isValidDate(input.date) && input.endDate < input.date)
      errors.push('End date cannot be before the start date.');
  }
  if (!input.location?.trim()) errors.push('Location is required.');
  else if (input.location.length > FIELD_LIMITS.location)
    errors.push(`Location must be ${FIELD_LIMITS.location} characters or fewer.`);
  if (input.description && input.description.length > FIELD_LIMITS.description)
    errors.push(`Description must be ${FIELD_LIMITS.description} characters or fewer.`);
  if (input.body && input.body.length > FIELD_LIMITS.body)
    errors.push(`Details must be ${FIELD_LIMITS.body} characters or fewer.`);
  return errors;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .replace(/-$/, '');
}

/** Build the content path, e.g. src/content/events/2026-05-21-strawberry.md */
export function eventPath(input: EventInput): string {
  const slug = slugify(input.title) || 'event';
  return `src/content/events/${input.date}-${slug}.md`;
}

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function yamlBlock(value: string): string {
  const lines = value.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n');
  return `|\n${lines.map((l) => `  ${l}`).join('\n')}`;
}

/** Serialize an event to Markdown with YAML frontmatter. */
export function serializeEvent(input: EventInput): string {
  const fm: string[] = [];
  fm.push(`title: ${yamlQuote(input.title.trim())}`);
  fm.push(`date: ${input.date.trim()}`);
  if (input.endDate?.trim()) fm.push(`endDate: ${input.endDate.trim()}`);
  fm.push(`location: ${yamlQuote(input.location.trim())}`);
  if (input.description?.trim()) fm.push(`description: ${yamlBlock(input.description)}`);
  fm.push(`featured: ${input.featured ? 'true' : 'false'}`);
  const body = input.body?.replace(/\r\n/g, '\n').trim() ?? '';
  return `---\n${fm.join('\n')}\n---\n\n${body}\n`;
}

/**
 * Parse our own frontmatter back into an EventInput, to prefill the form when
 * editing an existing event. Handles the keys this type emits, including the
 * `description: |` block scalar.
 */
export function parseEvent(markdown: string): EventInput {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const result: EventInput = {
    title: '',
    date: '',
    location: '',
    featured: false,
    body: '',
  };
  if (!match) {
    result.body = markdown.trim();
    return result;
  }
  const [, frontmatter, body] = match;
  result.body = body.trim();

  const lines = frontmatter.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    if (rawValue.trim() === '|') {
      const block: string[] = [];
      while (i + 1 < lines.length && /^\s{2,}/.test(lines[i + 1])) {
        block.push(lines[++i].replace(/^ {2}/, ''));
      }
      assignField(result, key, block.join('\n'));
    } else {
      assignField(result, key, unquote(rawValue.trim()));
    }
  }
  return result;
}

function unquote(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  return value;
}

function assignField(target: EventInput, key: string, value: string): void {
  switch (key) {
    case 'title':
      target.title = value;
      break;
    case 'date':
      target.date = value;
      break;
    case 'endDate':
      target.endDate = value;
      break;
    case 'location':
      target.location = value;
      break;
    case 'description':
      target.description = value;
      break;
    case 'featured':
      target.featured = value === 'true';
      break;
  }
}
