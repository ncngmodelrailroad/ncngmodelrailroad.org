// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import rehypeSanitize from 'rehype-sanitize';

// https://astro.build/config
export default defineConfig({
  site: 'https://ncngmodelrailroad.org',
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/styleguide'),
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  markdown: {
    // Strip unsafe raw HTML (scripts, inline event handlers, javascript: URLs)
    // from rendered Markdown. No site content uses raw HTML, so this only
    // matters for content submitted through the content editor.
    rehypePlugins: [rehypeSanitize],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
