import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://havik.space',
  // Fetch the next page on hover so it is ready by the time the transition curtain is down.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
