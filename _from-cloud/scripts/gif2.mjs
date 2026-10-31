import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.clock.install();
await p.goto('http://localhost:4321/', { waitUntil: 'load' });
await p.clock.runFor(2500);
await p.waitForLoadState('networkidle');
await p.mouse.move(720, 450);
await p.clock.runFor(500);
await p.clock.pauseAt(new Date(Date.now() + 5000));
await p.clock.runFor(100);
let n = 0;
const snap = async () => { await p.screenshot({ path: `${out}/g${String(n++).padStart(3, '0')}.png` }); };
await snap();
await p.keyboard.press('PageDown');
for (let i = 0; i < 36; i++) { await p.clock.runFor(i < 24 ? 20 : 80); await snap(); }
const pts = [[720,450],[1350,150],[1350,820],[120,820],[120,120],[720,450]];
for (let k = 1; k < pts.length; k++) {
  const [x0,y0] = pts[k-1], [x1,y1] = pts[k];
  for (let s = 1; s <= 8; s++) { await p.mouse.move(x0+(x1-x0)*s/8, y0+(y1-y0)*s/8); await p.clock.runFor(70); await snap(); }
}
await p.keyboard.press('PageDown');
for (let i = 0; i < 14; i++) { await p.clock.runFor(60); await snap(); }
await b.close();
console.log(n);
