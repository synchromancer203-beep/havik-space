import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [name, path, w, dpr] of [['post-full-vi','/vi/blog/nob-network/',1280,1],['post-full-en-mobile','/blog/nob-network/',390,2]]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  await p.close();
}
await b.close();
