import { chromium } from 'playwright';
const S = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const works = ['open','ecos-del-abismo','vanity-jsc','corrupted-moonlight','warcross','thanh-loi-dental'];
for (const [w,h] of [[1440,820],[1280,720],[1920,1080],[1024,768]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.route(/spotify|bandcamp/, r => r.fulfill({ body: '<body style="margin:0;background:#1db954"></body>', contentType: 'text/html' }));
  for (const wk of works) {
    await p.goto(`http://localhost:4321/media/?work=${wk}`); await p.waitForTimeout(1800);
    const m = await p.evaluate((wk) => { const a = document.getElementById('work-'+wk); const i = a.querySelector('.m-cover-media img'), f = a.querySelector('.m-info'); if(!i) return 'noimg'; const r1=i.getBoundingClientRect(), r2=f.getBoundingClientRect(); const l=f.querySelector('.m-links')?.getBoundingClientRect(); return [r1.top,r1.bottom,r2.top,l?.bottom, r1.width].map(Math.round).join(' '); }, wk);
    console.log(w,h,wk,m);
    if (['open','vanity-jsc','warcross'].includes(wk)) await p.screenshot({ path: `${S}/fit-${w}-${wk}.png` });
  }
}
await b.close();
