import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [name, path, w, h, dpr] of [['p2-1440-vi','/vi/blog/nightdrive-poesiomat/',1440,900,1],['p2-1280-en','/blog/nightdrive-poesiomat/',1280,800,1],['p2-390-vi','/vi/blog/nightdrive-poesiomat/',390,844,2],['bi-1440-en','/blog/',1440,900,1],['p1-1440-vi','/vi/blog/nob-network/',1440,900,1]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${name}.png` });
  await p.close();
}
await b.close();
