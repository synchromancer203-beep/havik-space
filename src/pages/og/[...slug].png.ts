// One share image per page and language: /og/<lang>/<slug>.png (see src/lib/og.ts, src/data/seo.ts).
import type { APIRoute, GetStaticPaths } from 'astro';
import { seo, ogSlug } from '../../data/seo';
import { languages, type Lang } from '../../i18n/ui';
import { renderOg } from '../../lib/og';

export const getStaticPaths = (() =>
  (Object.keys(languages) as Lang[]).flatMap((lang) =>
    Object.entries(seo).map(([path, page]) => ({
      params: { slug: `${lang}/${ogSlug(path)}` },
      props: { label: page.label[lang], isHome: path === '/' },
    })),
  )) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props as { label: string; isHome: boolean }), { headers: { 'Content-Type': 'image/png' } });
