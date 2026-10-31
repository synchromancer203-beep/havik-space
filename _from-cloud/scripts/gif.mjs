import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.mouse.move(720, 450);
let n = 0;
const snap = async () => { await p.screenshot({ path: `${out}/g${String(n++).padStart(3, '0')}.png`, type: 'png' }); };
await p.keyboard.press('PageDown');
const t0 = Date.now();
while (Date.now() - t0 < 2200) await snap();
// pointer sweep
const pts = [[720,450],[1300,200],[1300,800],[150,800],[150,150],[720,450]];
for (let k = 1; k < pts.length; k++) {
  const [x0,y0] = pts[k-1], [x1,y1] = pts[k];
  for (let s = 1; s <= 6; s++) { await p.mouse.move(x0+(x1-x0)*s/6, y0+(y1-y0)*s/6); await snap(); }
}
await p.keyboard.press('PageDown');
const t1 = Date.now();
while (Date.now() - t1 < 900) await snap();
await b.close();
console.log(n);
