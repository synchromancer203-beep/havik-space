import { ui, defaultLang, type Lang, type UIKey } from './ui';

export function getLang(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'vi' ? 'vi' : defaultLang;
}

export function useT(lang: Lang) {
  return (key: UIKey) => ui[lang][key] ?? ui[defaultLang][key];
}

/** Build a localized href from a language-neutral path like "/about" or "/media?tab=music".
 *  Bare hashes ("#contact") stay on the current page: the footer is on every page. */
export function href(lang: Lang, path: string) {
  if (path.startsWith('#')) return path;
  const [rest, hash] = path.split('#');
  const [p, query] = rest.split('?');
  let clean = p === '/' ? '/' : `/${p.replace(/^\/|\/$/g, '')}/`;
  if (lang !== defaultLang) clean = clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
  return clean + (query ? `?${query}` : '') + (hash ? `#${hash}` : '');
}

/** Strip the language prefix, returning the neutral path. */
export function neutralPath(pathname: string) {
  const stripped = pathname.replace(/^\/vi(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Same page in the other language. Every page exists in both, so this is a direct swap. */
export function alternate(url: URL, target: Lang) {
  return href(target, neutralPath(url.pathname));
}

export type NavItem = { key: UIKey; path: string; children?: { key: UIKey; path: string }[] };

export const nav: NavItem[] = [
  { key: 'nav.home', path: '/' },
  {
    key: 'nav.specialties',
    path: '/specialties',
    children: [
      { key: 'spec.music', path: '/specialties/music' },
      { key: 'spec.visual', path: '/specialties/visual' },
      { key: 'spec.marketing', path: '/specialties/marketing' },
    ],
  },
  { key: 'nav.about', path: '/about' },
  {
    key: 'nav.media',
    path: '/media',
    children: [
      { key: 'media.music', path: '/media?tab=music' },
      { key: 'media.visual', path: '/media?tab=visual' },
      { key: 'media.marketing', path: '/media?tab=marketing' },
      // Blog hidden until the first post exists.
    ],
  },
  { key: 'nav.contact', path: '#contact' },
];
