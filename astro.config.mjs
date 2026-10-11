import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://havik.space',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', vi: 'vi' } },
      // Leave out the /en/ redirect stubs and the 404 page.
      filter: (page) => !/havik\.space\/(en\/|404)/.test(page),
    }),
  ],
  // Inline the (small) stylesheets: one round trip less before first paint.
  build: { inlineStylesheets: 'always' },
  // Scope by class, so a page's scoped styles reach components it passes `class` to (Frame).
  scopedStyleStrategy: 'class',
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
