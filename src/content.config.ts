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
      // Music: a player above the buttons. The iframe src of a Spotify or Bandcamp embed.
      embed: z.string().url().optional(),
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

// Blog: one folder per post, src/content/posts/<slug>/ with vi.md (the owner's text) and en.md
// (the translation), and the post's images next to them.
const posts = defineCollection({
  loader: glob({ pattern: '*/{vi,en}.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string(),
      cover: image(),
      coverAlt: z.string(),
      /** Optional second photo, shown beside the cover in the post's head. */
      cover2: image().optional(),
      cover2Alt: z.string().optional(),
    }),
});

export const collections = { works, books, posts };
