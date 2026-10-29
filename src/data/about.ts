// Copy for /about. VN from content/03-about; EN mirrors the VN facts (draft for review).
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';
import teach1 from '../assets/about/chung-chi-su-pham-1.webp';
import teach2 from '../assets/about/chung-chi-su-pham-2.webp';

type Bi = Record<Lang, string>;

// shots: photos of the paper itself, a thumbnail beside the entry that opens a viewer.
export interface Entry { when: string; what: Bi; where?: Bi; shots?: ImageMetadata[]; }
export interface Section { id: string; title: Bi; entries: Entry[]; }

const same = (s: string): Bi => ({ vi: s, en: s });

export const timeline: Section[] = [
  {
    id: 'work',
    title: { vi: 'Nghề nghiệp', en: 'Work' },
    entries: [
      { when: '03/2026 —', what: same('Founder & CEO'), where: same('NÓB Network') },
      { when: '10/2025 —', what: same('Co-founder & COO'), where: same('iMind Việt Nam') },
      { when: '2025', what: same('Senior Graphic Designer & Marketing Executive'), where: same('iMedia Agency') },
      { when: '2024 – 2025', what: same('Junior Graphic Designer'), where: same('PunkGaMe Việt Nam') },
      { when: '09/2024 —', what: same('Website Designer & Product Manager'), where: { vi: 'Gardenizi · bán thời gian', en: 'Gardenizi · part-time' } },
      { when: '03/2019 —', what: same('Co-founder & Event Organizer'), where: { vi: 'Noise Night Việt Nam · bán thời gian', en: 'Noise Night Vietnam · part-time' } },
      { when: '01/2019 —', what: same('Founder, Director & Producer'), where: same('Corrupted Moonlight') },
    ],
  },
  {
    id: 'edu',
    title: { vi: 'Học vấn', en: 'Education' },
    entries: [
      { when: '2019 – 2024', what: { vi: 'Cử nhân Thiết kế đồ họa', en: 'BA, Graphic Design' }, where: { vi: 'Đại học Mỹ thuật Công nghiệp Hà Nội', en: 'Hanoi University of Industrial Fine Arts' } },
      { when: '2024 – 2026', what: { vi: 'Chứng chỉ Digital Marketing Institute (DMI)', en: 'Digital Marketing Institute (DMI) certificate' }, where: same('VTC Academy') },
    ],
  },
  {
    id: 'awards',
    title: { vi: 'Dấu mốc', en: 'Highlights' },
    entries: [
      { when: '2022', what: same("Hanoi Grapevine's Finest Artist Appreciation"), where: same('Corrupted Moonlight') },
    ],
  },
  {
    id: 'certs',
    title: { vi: 'Chứng chỉ', en: 'Certificates' },
    entries: [
      { when: '10/2026', what: { vi: 'Chứng chỉ nghiệp vụ sư phạm', en: 'Teaching certificate' }, shots: [teach1, teach2] },
      { when: '2026', what: same('Claude Certified AI Fluency for Educators') },
      { when: '2026', what: same('Google Gemini Certified Educator') },
      { when: '2019 – 2021', what: same('IELTS 6.5') },
    ],
  },
];

export const skills: { title: Bi; items: string[] }[] = [
  { title: { vi: 'Âm nhạc', en: 'Music' }, items: ['Music Production', 'Music Composition', 'Music Performance'] },
  { title: { vi: 'Đồ họa', en: 'Visual' }, items: ['Graphic Design', 'Video Editing', 'Web Design', '3D Modeling', 'Content Creation'] },
  { title: { vi: 'Marketing', en: 'Marketing' }, items: ['Digital Marketing', 'Marketing Strategy', 'Creative Strategy', 'Social Media Marketing', 'Market Research'] },
  { title: { vi: 'Vận hành', en: 'Operations' }, items: ['Generative AI', 'Agentic AI Systems', 'Project & Team Management', 'Event Organizing', 'Entrepreneurship', 'Creative Problem Solving'] },
];
