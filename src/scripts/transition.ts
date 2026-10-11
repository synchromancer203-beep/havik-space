// Page transitions (~0.8s). On an internal link click a paper layer fades in over the page and a
// band of fine Vivid Blue riso grain sweeps down across it from the top edge to the bottom. Only once
// the band has left (plain paper, nothing moving, so load time doesn't read as a stall) does the
// browser navigate. The next page is flagged (sessionStorage, read by the inline script in Base's
// <head>) so it paints under the same paper layer, which then fades away. That fade is a
// compositor opacity animation, so it stays smooth while the new page is still busy starting up.
// GSAP's global timeline is held until the fade starts, so each page's entrance plays as it is
// revealed. Cross-document View Transitions (global.css) keep the frame between documents.
import { gsap } from './smooth';

const KEY = 'pt';
const BLUE = 0xffff3747; // #4737FF as little-endian ABGR
const BAND = 0.9; // band height, share of the viewport
const root = document.documentElement;
const layer = document.querySelector<HTMLElement>('.pt')!;
const canvas = layer.querySelector('canvas')!;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = () => (window as any).__lenis;

let leaving = false;
let frame = 0;
let markReady!: () => void;
/** Resolves once the page is visible (immediately when it wasn't entered through a transition). */
export const ready = new Promise<void>((r) => (markReady = r));

// ---------- Riso band: tiny 2px cells, inked where a white-noise threshold is under the row's density
let ctx: CanvasRenderingContext2D, img: ImageData, buf: Uint32Array, thr: Uint8Array, lv: Uint16Array, w = 0, h = 0;

function build() {
  const cell = Math.max(2, Math.ceil(Math.sqrt((innerWidth * innerHeight) / 1e6)));
  w = Math.ceil(innerWidth / cell);
  h = Math.ceil(innerHeight / cell);
  canvas.width = w;
  canvas.height = h;
  ctx = canvas.getContext('2d')!;
  img = ctx.createImageData(w, h);
  buf = new Uint32Array(img.data.buffer);
  thr = new Uint8Array(w * h);
  lv = new Uint16Array(h);
  for (let i = 0; i < thr.length; i += 65536) crypto.getRandomValues(thr.subarray(i, i + 65536)); // 64KB cap per call
}

/** u: 0 at the band's leading edge, 1 at its trailing edge. Sparse lead, dense core, short tail. */
const density = (u: number) =>
  u <= 0 || u >= 1 ? 0 : u < 0.8 ? (u / 0.8) ** 1.8 : 1 - ((u - 0.8) / 0.2) ** 0.7;

/** pos: 0 = band just above the screen, 1 = gone off the bottom. Moving down, it leads with its lower edge. */
function draw(pos: number) {
  const lead = (pos * (1 + BAND)) * h; // leading edge, in rows from the top
  const bh = BAND * h;
  for (let y = 0; y < h; y++) lv[y] = density((lead - y) / bh) * 256;
  for (let y = 0, i = 0; y < h; y++) {
    const l = lv[y];
    if (!l) { buf.fill(0, i, i + w); i += w; continue; }
    for (let x = 0; x < w; x++, i++) buf[i] = thr[i] < l ? BLUE : 0;
  }
  ctx.putImageData(img, 0, 0);
}

/** Run step(t) for t in 0..1 over `ms`, timed from the first animation frame so it never jumps. */
function play(ms: number, step: (t: number) => void) {
  cancelAnimationFrame(frame);
  return new Promise<void>((done) => {
    let start = 0;
    const tick = (now: number) => {
      start ||= now;
      const t = Math.min(1, (now - start) / ms);
      step(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else done();
    };
    frame = requestAnimationFrame(tick);
  });
}

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function hide() {
  cancelAnimationFrame(frame);
  layer.getAnimations().forEach((a) => a.cancel());
  layer.classList.remove('on');
  root.classList.remove('pt-in');
}

async function leave(url: string) {
  leaving = true;
  lenis()?.stop();
  try { sessionStorage.setItem(KEY, String(Date.now())); } catch {}
  build();
  draw(0);
  layer.classList.add('on');
  layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out', fill: 'forwards' });
  await wait(80);
  await play(400, (t) => draw(easeInOut(t)));
  location.assign(url);
}

async function arrive() {
  gsap.globalTimeline.pause();
  await Promise.race([document.fonts.ready, wait(400)]);
  await new Promise(requestAnimationFrame);
  layer.classList.add('on');
  root.classList.remove('pt-in');
  gsap.globalTimeline.resume();
  markReady();
  layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: 'ease-in-out' }).finished.then(hide, () => {});
}

if (root.classList.contains('pt-in')) arrive();
else markReady();

document.addEventListener('click', (e) => {
  if (reduce || leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.closest('[data-no-transition]')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  // Same document (hash only): smooth.ts glides there instead.
  if (url.pathname === location.pathname && url.search === location.search) return;
  e.preventDefault();
  leave(url.href);
});

// Back/forward restores this page from bfcache with the layer still up: put it away.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  leaving = false;
  hide();
  gsap.globalTimeline.resume();
  lenis()?.start();
});
