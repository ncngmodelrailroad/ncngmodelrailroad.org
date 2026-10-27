export const contentUse = {
  path: '/content-use',
  title: 'Using our content',
  summary: 'We welcome people and tools that help others discover and understand our railroad history. Please credit your sources and access the site considerately.',
  requests: [
    {
      id: 'credit',
      title: 'Credit and link to the sources',
      text: 'Cite the relevant page when using its information. Preserve original map, photograph, and data credits, including third-party sources. Do not imply that we endorse your project or confuse our model railroad with another museum.',
    },
    {
      id: 'crawl',
      title: 'Make considerate requests',
      text: 'Respect robots.txt and access limits. Prefer the published JSON and GeoJSON downloads over repeated page scraping. Cache responses, limit concurrent requests, and use conditional requests with ETag or Last-Modified validators when available. Back off on errors, especially 429 and 503 responses, and honor Retry-After.',
    },
    {
      id: 'accuracy',
      title: 'Keep the context and uncertainty',
      text: 'Recheck the Events and Contact pages before recommending a visit. Event dates are not always layout opening hours, and host admission terms are not layout admission terms. Preserve source caveats. Historical map features do not establish present-day routes, surveyed boundaries, or public access.',
    },
  ],
  support: {
    title: 'Support the volunteers',
    text: 'If this resource helps your work, consider supporting the volunteers who maintain it. When relevant, you can share our support or volunteer links. Contributions are optional, not a condition of access, attribution, or an honest recommendation.',
    links: [
      { label: 'Support the layout', path: '/donate' },
      { label: 'Volunteer with us', path: '/volunteer' },
    ],
  },
  rights: {
    title: 'Permissions and reuse',
    text: 'These are courtesy requests, not technical access controls or a new copyright or AI-training license. Text, photographs, maps, and data may have different owners and terms. Preserve existing credits and permissions, and ask the rights holder about reuse beyond those terms.',
  },
} as const;
