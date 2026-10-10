import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://havik.space',
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
