// Copy for /specialties and its three sub-pages. VN from khung-noi-dung.md and content/02-specialties;
// EN is a draft for the owner to review. Facts only, no slogans.
import type { Lang } from '../i18n/ui';

type Bi = Record<Lang, string>;
type BiList = Record<Lang, string[]>;

export interface Group {
  id: string;
  title: Bi;
  services: BiList;
  /** Work slugs to feature when the collection has none in this group yet. */
  extraWorks?: string[];
}

export interface Specialty {
  id: 'music' | 'visual' | 'marketing';
  path: string;
  line: Bi;
  intro: Bi;
  services?: BiList;
  groups?: Group[];
  skills: string[];
  tools?: string[];
  peopleLabel?: Bi;
  people?: string[];
}

export const specialties: Specialty[] = [
  {
    id: 'music',
    path: '/specialties/music',
    line: {
      vi: 'Sáng tác, sản xuất và biểu diễn nhạc điện tử từ 2019.',
      en: 'Writing, producing and playing electronic music since 2019.',
    },
    intro: {
      vi: 'Từ 2019 tôi làm nhạc cùng Corrupted Moonlight, ban nhạc synthwave đầu tiên tại Việt Nam. Song song là noise thực nghiệm với Mare Crisisium, vaporwave với Vanity. JSC, session guitar cho các ban nhạc Hà Nội, và mix, master, sound design cho nghệ sĩ khác.',
      en: 'Since 2019 I have made music with Corrupted Moonlight, the first synthwave band in Vietnam. Alongside that: experimental noise as Mare Crisisium, vaporwave as Vanity. JSC, session guitar for Hanoi bands, and mixing, mastering and sound design for other artists.',
    },
    services: {
      vi: ['Sản xuất & phối khí', 'Mix & master', 'Sound design & synth', 'Biểu diễn live: solo, ban nhạc, session guitar', 'Workshop synthesizer', 'Visualizer cho nhạc'],
      en: ['Production & arrangement', 'Mixing & mastering', 'Sound design & synths', 'Live performance: solo, band, session guitar', 'Synthesizer workshops', 'Music visualizers'],
    },
    skills: ['Music Production', 'Music Composition', 'Music Performance', 'Live Electronic', 'Mixing & Mastering', 'Sound Design'],
    peopleLabel: { vi: 'Đã hợp tác', en: 'Worked with' },
    people: ['The Flob', 'in memory of the view from hanoi opera house', 'Mukang Fields', 'Aura Màu Đen', 'Mạc Kịch', 'TPOLE', 'Pha hay Fmaj7', 'intermusic'],
  },
  {
    id: 'visual',
    path: '/specialties/visual',
    line: {
      vi: 'Poster, bìa đĩa, sách, website và 3D.',
      en: 'Posters, record and book covers, websites and 3D.',
    },
    intro: {
      vi: 'Cử nhân Thiết kế đồ họa, Đại học Mỹ thuật Công nghiệp Hà Nội (2019–2024). Tôi làm poster cho các đêm noise, bìa và minh họa sách, bao bì cassette cho chính ban nhạc của mình, và website cho doanh nghiệp.',
      en: 'BA in Graphic Design, Hanoi University of Industrial Fine Arts (2019–2024). I make posters for noise nights, book covers and illustrations, cassette packaging for my own band, and websites for businesses.',
    },
    groups: [
      {
        id: 'graphic',
        title: { vi: 'Thiết kế đồ họa', en: 'Graphic design' },
        services: {
          vi: ['Poster sự kiện', 'Bìa album & sách', 'Nhận diện thương hiệu', 'Ấn phẩm social', 'Edit video'],
          en: ['Event posters', 'Album & book covers', 'Brand identity', 'Social assets', 'Video editing'],
        },
      },
      {
        id: 'web',
        title: { vi: 'Thiết kế web', en: 'Web design' },
        services: {
          vi: ['Thiết kế giao diện', 'Landing page', 'Website giới thiệu doanh nghiệp'],
          en: ['Interface design', 'Landing pages', 'Company websites'],
        },
      },
      {
        id: '3d',
        title: { vi: 'Thiết kế 3D', en: '3D design' },
        services: {
          vi: ['Visualizer âm nhạc', 'Mockup sản phẩm'],
          en: ['Music visualizers', 'Product mockups'],
        },
        extraWorks: ['vegas-re-imagined-mix'],
      },
    ],
    skills: ['Graphic Design', 'Video Editing', 'Web Design', '3D Modeling', 'Illustration'],
  },
  {
    id: 'marketing',
    path: '/specialties/marketing',
    line: {
      vi: 'Chiến lược và hệ thống marketing cho doanh nghiệp và nghệ sĩ.',
      en: 'Strategy and marketing systems for businesses and artists.',
    },
    intro: {
      vi: 'Chứng chỉ Digital Marketing Institute (DMI) tại VTC Academy. Co-founder & COO của iMind Việt Nam từ 10/2025, xây hệ thống marketing vận hành bằng AI cho doanh nghiệp. Từ 03/2026 là Founder & CEO của NÓB Network, xây mạng lưới nghệ sĩ Live Electronic từ con số 0.',
      en: 'Digital Marketing Institute (DMI) certified at VTC Academy. Co-founder & COO of iMind Việt Nam since October 2025, building AI-run marketing systems for businesses. Founder & CEO of NÓB Network since March 2026, building a live electronic artist network from zero.',
    },
    services: {
      vi: ['Chiến lược thương hiệu', 'Kế hoạch ra mắt: sản phẩm, nghệ sĩ, sự kiện', 'Hệ thống marketing', 'Nội dung social', 'Đào tạo đội ngũ marketing'],
      en: ['Brand strategy', 'Launch plans: products, artists, events', 'Marketing systems', 'Social content', 'Marketing team training'],
    },
    skills: ['Digital Marketing', 'Marketing Strategy', 'Creative Strategy', 'Social Media Marketing', 'Market Research', 'Agentic AI'],
    peopleLabel: { vi: 'Đối tác', en: 'Partners' },
    people: ['HUB', 'OTTO Bar', 'Anatolia in Hanoi', 'Complex 01', 'Polygon', 'Cheshire', 'Thăng Long Records', 'Cổ Động'],
  },
];

export const combined: Bi = {
  vi: 'Ra mắt trọn gói: sản xuất bài hát, thiết kế và gia công bao bì, poster và visualizer, rồi lên kế hoạch truyền thông. Tôi từng làm cả chuỗi này cho chiến dịch ra mắt cassette của Corrupted Moonlight (2022) tại Hà Nội và Sài Gòn.',
  en: "Full release: produce the track, design and manufacture the packaging, make the poster and visualizer, then plan the rollout. I did the whole chain for Corrupted Moonlight's cassette launch in 2022, in Hanoi and Saigon.",
};
