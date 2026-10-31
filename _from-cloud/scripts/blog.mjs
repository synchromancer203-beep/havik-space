import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const go = async (name, path, w, h, dpr, steps = []) => {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${name}.png` });
  for (const [k, n] of steps) { await p.keyboard.press(k); await p.waitForTimeout(1600); await p.screenshot({ path: `${out}/${name}-${n}.png` }); }
  await p.close();
};
await go('b-idx-1440-vi', '/vi/blog/', 1440, 900, 1);
await go('b-idx-390-vi', '/vi/blog/', 390, 844, 2);
await go('b-post-1440-vi', '/vi/blog/nob-network/', 1440, 900, 1, [['PageDown', 'body'], ['ArrowDown', 'body2']]);
await go('b-post-390-vi', '/vi/blog/nob-network/', 390, 844, 2, [['PageDown', 'body']]);
await go('b-post-1280-en', '/blog/nob-network/', 1280, 800, 1);
await go('b-hdr-1024-vi', '/vi/blog/', 1024, 768, 1);
await b.close();
