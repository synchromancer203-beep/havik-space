import { chromium } from 'playwright';
const out = process.argv[2], tag = process.argv[3], only = process.argv[4];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const shots = [
  ['desk-1440-en', '/', 1440, 900, 1],
  ['desk-1920-vi', '/vi/', 1920, 880, 1],
  ['desk-1280-vi', '/vi/', 1280, 800, 1],
  ['mob-390-vi', '/vi/', 390, 844, 2],
  ['mob-375-en', '/', 375, 667, 2],
  ['mob-360-vi', '/vi/', 360, 640, 2],
];
for (const [name, path, w, h, dpr] of shots) {
  if (only && !name.includes(only)) continue;
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.keyboard.press('PageDown');
  await p.waitForTimeout(2400);
  await p.screenshot({ path: `${out}/${tag}-${name}.png` });
  if (name.startsWith('desk-1440') || name.startsWith('mob-390')) {
    await p.keyboard.press('PageDown'); await p.waitForTimeout(140);
    await p.screenshot({ path: `${out}/${tag}-${name}-leaving.png` });
    await p.waitForTimeout(2000);
    await p.keyboard.press('PageUp'); await p.waitForTimeout(200);
    await p.screenshot({ path: `${out}/${tag}-${name}-back.png` });
    await p.waitForTimeout(2000);
    await p.keyboard.press('PageUp'); await p.waitForTimeout(140);
    await p.screenshot({ path: `${out}/${tag}-${name}-tohero.png` });
  }
  await p.close();
}
await b.close();
