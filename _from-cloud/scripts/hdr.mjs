import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [name, path, w] of [['h1024vi','/vi/blog/',1024],['h1024en','/blog/',1024],['h1280vi','/vi/blog/',1280],['h1440vi','/vi/blog/',1440]]) {
  const p = await b.newPage({ viewport: { width: w, height: 300 } });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => { const t = document.querySelector('.tools').getBoundingClientRect(); return [Math.round(t.right), innerWidth, document.documentElement.scrollWidth]; });
  console.log(name, r);
  await p.screenshot({ path: `${out}/${name}.png`, clip: { x: 0, y: 0, width: w, height: 70 } });
  await p.close();
}
await b.close();
