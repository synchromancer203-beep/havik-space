// Blog helpers: posts live in src/content/posts/<slug>/{vi,en}.md (see content.config.ts).
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'posts'>;

export const slugOf = (p: Post) => p.id.split('/')[0];

/** One language's posts, newest first. */
export async function postsIn(lang: Lang) {
  return (await getCollection('posts', (p) => p.id.endsWith(`/${lang}`))).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** "10 March 2026" / "10 tháng 3, 2026" */
export const formatDate = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
