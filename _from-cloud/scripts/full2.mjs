import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
await p.goto('http://localhost:4321/vi/blog/nob-network/', { waitUntil: 'networkidle' });
for (let y = 0; y < 4600; y += 400) { await p.mouse.wheel(0, 400); await p.waitForTimeout(120); }
await p.waitForTimeout(800);
const ok = await p.evaluate(() => [...document.querySelectorAll('.prose img')].map((i) => [i.complete, i.naturalWidth, i.currentSrc.slice(-40)]));
console.log(JSON.stringify(ok));
await p.screenshot({ path: `${out}/post-full-vi.png`, fullPage: true });
await b.close();
