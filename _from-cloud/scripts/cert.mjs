import { chromium } from 'playwright';
const S = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,h,n] of [[1440,820,'d'],[390,844,'m']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4321/about/'); await p.waitForTimeout(1500);
  for (let i=0;i<2;i++){ await p.keyboard.press('PageDown'); await p.waitForTimeout(1300); }
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${S}/cert-${n}.png` });
  await p.click('.tl-shot'); await p.waitForTimeout(800);
  await p.screenshot({ path: `${S}/cert-${n}-lb1.png` });
  await p.click('.tl-lb-next'); await p.waitForTimeout(800);
  await p.screenshot({ path: `${S}/cert-${n}-lb2.png` });
}
await b.close();
