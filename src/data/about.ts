// Copy for /about. VN from content/03-about; EN mirrors the VN facts (draft for review).
import type { Lang } from '../i18n/ui';

type Bi = Record<Lang, string>;

export const bio: Record<Lang, string[]> = {
  vi: [
    'Từ năm 2019, tôi làm nhạc cùng Corrupted Moonlight tại Hà Nội, ban nhạc tiên phong chơi nhạc synthwave đầu tiên tại Việt Nam. Năm 2022, dự án được vinh danh Hanoi Grapevine\'s Finest Artist Appreciation.',
    'Song song với âm nhạc, tôi học Thiết kế đồ họa tại Đại học Mỹ thuật Công nghiệp Hà Nội (2019–2024) và lấy chứng chỉ Digital Marketing Institute (DMI) tại VTC Academy (2024–2026). Tôi đồng sáng lập và tổ chức sự kiện cùng Noise Night Việt Nam từ 2019, và là Website Designer & Product Manager cho Gardenizi từ 2024. Năm 2025, tôi đồng sáng lập iMind Việt Nam với vai trò Co-founder & COO, xây dựng hệ thống marketing dựa trên Agentic AI và quy trình vận hành tinh gọn cho doanh nghiệp.',
    'Từ tháng 3/2026, tôi là Founder & CEO của NÓB Network, xây dựng hệ sinh thái cho nhạc Live Electronic tại Việt Nam: kết nối nghệ sĩ độc lập với thương hiệu và đơn vị tổ chức sự kiện. Tôi đang tìm kiếm cộng tác viên, chiến lược gia sáng tạo và marketer cho hành trình này.',
  ],
  en: [
    "Since 2019 I have made music with Corrupted Moonlight in Hanoi, the first band to play synthwave in Vietnam. In 2022 the project received Hanoi Grapevine's Finest Artist Appreciation.",
    'Alongside music, I studied Graphic Design at Hanoi University of Industrial Fine Arts (2019–2024) and earned the Digital Marketing Institute (DMI) certificate at VTC Academy (2024–2026). I co-founded and organise events with Noise Night Vietnam since 2019, and have been Website Designer & Product Manager at Gardenizi since 2024. In 2025 I co-founded iMind Việt Nam as Co-founder & COO, building Agentic-AI marketing systems and lean operations for businesses.',
    'Since March 2026 I have been Founder & CEO of NÓB Network, building an ecosystem for live electronic music in Vietnam that connects independent artists with brands and event organisers. I am looking for collaborators, creative strategists and marketers to join.',
  ],
};

export interface Entry { when: string; what: Bi; where?: Bi; }
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
      { when: '2019', what: { vi: 'Ban nhạc synthwave đầu tiên tại Việt Nam', en: 'First synthwave band in Vietnam' }, where: same('Corrupted Moonlight') },
      { when: '2024 – 2025', what: { vi: 'Cuộc thi vẽ tranh toàn quốc, trưng bày tại VCCA Hà Nội', en: 'National drawing contest, exhibited at VCCA Hanoi' }, where: same('PunkGaMe') },
    ],
  },
  {
    id: 'certs',
    title: { vi: 'Chứng chỉ', en: 'Certificates' },
    entries: [
      { when: '10/2026', what: { vi: 'Chứng chỉ nghiệp vụ sư phạm', en: 'Teaching certificate' } },
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
