import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://havik.space',
  // Fetch the next page on hover so it is ready by the time the transition reaches it.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: { prefixDefaultLocale: false },
  },
  // English moved from /en/ to the root (Vietnamese now lives under /vi/); keep old links working.
  redirects: Object.fromEntries(
    ['', '/about', '/media', '/privacy', '/specialties', '/specialties/music', '/specialties/visual', '/specialties/marketing']
      .map((p) => [`/en${p}`, `${p}/`]),
  ),
});
