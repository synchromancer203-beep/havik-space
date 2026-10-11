// Per-page SEO copy: meta description and the label printed on each page's share (OG) image.
// Drafted from the site's own copy (specialties.ts, about.ts) for the owner to review. Facts only.
import type { Lang } from '../i18n/ui';

type Bi = Record<Lang, string>;

export interface PageSeo {
  /** Big label on the OG image. */
  label: Bi;
  description: Bi;
}

/** Keyed by language-neutral path without trailing slash ("/" for home). */
export const seo: Record<string, PageSeo> = {
  '/': {
    label: { en: 'HAVIK', vi: 'HAVIK' },
    description: {
      en: 'Havik, Hanoi: electronic music with Corrupted Moonlight since 2019, graphic and web design, and marketing for businesses and artists.',
      vi: 'Havik, Hà Nội: làm nhạc điện tử cùng Corrupted Moonlight từ 2019, thiết kế đồ họa và web, marketing cho doanh nghiệp và nghệ sĩ.',
    },
  },
  '/specialties': {
    label: { en: 'Specialties', vi: 'Chuyên môn' },
    description: {
      en: 'Music, visual and marketing: what Havik makes and the services open for collaboration.',
      vi: 'Âm nhạc, đồ họa và marketing: những gì Havik làm và các dịch vụ nhận hợp tác.',
    },
  },
  '/specialties/music': {
    label: { en: 'Music', vi: 'Âm nhạc' },
    description: {
      en: 'Production, mixing and mastering, sound design and live electronic sets. Corrupted Moonlight, Mare Crisisium and session guitar in Hanoi since 2019.',
      vi: 'Sản xuất, mix & master, sound design và biểu diễn live electronic. Corrupted Moonlight, Mare Crisisium và session guitar tại Hà Nội từ 2019.',
    },
  },
  '/specialties/visual': {
    label: { en: 'Visual', vi: 'Đồ họa' },
    description: {
      en: 'Event posters, record and book covers, brand identity, websites and 3D. BA in Graphic Design, Hanoi University of Industrial Fine Arts.',
      vi: 'Poster sự kiện, bìa đĩa và sách, nhận diện thương hiệu, website và 3D. Cử nhân Thiết kế đồ họa, Đại học Mỹ thuật Công nghiệp Hà Nội.',
    },
  },
  '/specialties/marketing': {
    label: { en: 'Marketing', vi: 'Marketing' },
    description: {
      en: 'Strategy and marketing systems for businesses and artists. DMI certified; Co-founder & COO of iMind Việt Nam.',
      vi: 'Chiến lược và hệ thống marketing cho doanh nghiệp và nghệ sĩ. Chứng chỉ DMI; Co-founder & COO của iMind Việt Nam.',
    },
  },
  '/about': {
    label: { en: 'About', vi: 'Tiểu sử' },
    description: {
      en: 'Founder & CEO of NÓB Network, Co-founder & COO of iMind Việt Nam, founder of Corrupted Moonlight. Bio, work history, education and skills.',
      vi: 'Founder & CEO của NÓB Network, Co-founder & COO của iMind Việt Nam, người sáng lập Corrupted Moonlight. Tiểu sử, kinh nghiệm, học vấn và kỹ năng.',
    },
  },
  '/media': {
    label: { en: 'Work', vi: 'Tác phẩm' },
    description: {
      en: 'Music projects, graphic work and marketing initiatives by Havik.',
      vi: 'Dự án âm nhạc, ấn phẩm đồ họa và sáng kiến marketing của Havik.',
    },
  },
  '/privacy': {
    label: { en: 'Privacy', vi: 'Quyền riêng tư' },
    description: {
      en: 'How havik.space handles data: no forms, no tracking cookies.',
      vi: 'Cách havik.space xử lý dữ liệu: không form, không cookie theo dõi.',
    },
  },
};

/** File-safe slug for a page's OG image: "/" → "home", "/specialties/music" → "specialties-music". */
export const ogSlug = (path: string) => (path === '/' ? 'home' : path.slice(1).replace(/\//g, '-'));
