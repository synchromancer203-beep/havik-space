import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bi = z.object({ vi: z.string(), en: z.string() });

const works = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['music', 'visual', 'marketing']),
      group: z.enum(['live', 'producing', 'graphic', 'web', '3d', 'marketing']),
      order: z.number().default(99),
      sort: z.number(),
      featured: z.boolean().default(false),
      year: bi,
      kind: bi,
      role: bi,
      desc: bi,
      client: bi.optional(),
      results: bi.optional(),
      cover: image().optional(),
      gallery: z.array(image()).default([]),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    }),
});

export const collections = { works };
