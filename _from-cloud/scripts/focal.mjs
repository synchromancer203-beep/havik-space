import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [name, w, h, dpr] of [['fd', 1440, 900, 1], ['fm', 390, 844, 2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto('http://localhost:4321/vi/bookshelf/', { waitUntil: 'networkidle' });
  await p.mouse.move(5, h - 5);
  for (let i = 0; i < 4; i++) { await p.waitForTimeout(i ? 1500 : 2200); await p.screenshot({ path: `${out}/${name}${i}.png` }); }
  await p.close();
}
await b.close();
