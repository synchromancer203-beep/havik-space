import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [name, path, w, h, dpr] of [['bs-1440-vi','/vi/bookshelf/',1440,900,1],['bs-390-vi','/vi/bookshelf/',390,844,2],['bs-1024-vi','/vi/bookshelf/',1024,768,1],['bs-1280-en','/bookshelf/',1280,800,1]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  await p.mouse.move(5, h - 5);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/${name}.png` });
  if (name === 'bs-1440-vi') {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: `${out}/${name}-later.png` });
    await p.click('.menu .item:nth-child(5) a, header a[href$="bookshelf/"]', { trial: true }).catch(() => {});
  }
  await p.close();
}
await b.close();
