import { chromium } from 'playwright';
const out = process.argv[2], tag = process.argv[3];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const shots = [
  ['desk-1440-en', '/', 1440, 900, 1],
  ['desk-1920-en', '/', 1920, 880, 1],
  ['desk-1280-vi', '/vi/', 1280, 800, 1],
  ['mob-390-vi', '/vi/', 390, 844, 2],
  ['mob-390-en', '/', 390, 844, 2],
  ['mob-375-vi', '/vi/', 375, 667, 2],
  ['mob-360-en', '/', 360, 640, 2],
  ['tab-820-vi', '/vi/', 820, 1180, 1],
];
for (const [name, path, w, h, dpr] of shots) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.keyboard.press('PageDown');
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${out}/${tag}-${name}.png` });
  await p.close();
}
await b.close();
