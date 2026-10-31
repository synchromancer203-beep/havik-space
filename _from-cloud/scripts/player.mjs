import { chromium } from 'playwright';
const S = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,h,n] of [[1440,820,'d'],[390,844,'m'],[1280,720,'s']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.route(/spotify|bandcamp/, r => r.fulfill({ body: '<body style="margin:0;background:#1db954"></body>', contentType: 'text/html' }));
  await p.goto('http://localhost:4321/media/#work-ecos-del-abismo'); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${S}/player-${n}.png` });
  await p.goto('http://localhost:4321/media/#work-mare-crisisium'); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${S}/player-bc-${n}.png` });
}
await b.close();
