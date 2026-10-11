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

// Bookshelf: one file per book, src/content/books/<slug>.md (+ its cover image next to it).
// Shown cover only, with title, author and year underneath; lower order comes first.
const books = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/books' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      year: z.union([z.number(), z.string()]),
      cover: image(),
      order: z.number().default(99),
    }),
});

export const collections = { works, books };
