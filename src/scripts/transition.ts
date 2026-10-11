// Page transitions. On an internal link click the page dissolves into paper through a veil of
// tiny riso cells with a scatter of Vivid Blue ink (never a solid colour), then the browser
// navigates. The next page is flagged (sessionStorage, read by the inline script in Base's
// <head>) so it paints already veiled; once fonts are in, the paper cells drop away and the ink
// thins out. The veil is drawn by the inline renderer next to the canvas in Base (window.__pt).
// GSAP's global timeline is held while veiled so each page's entrance plays as it is revealed.
// Cross-document View Transitions (global.css) keep the frame on screen between documents.
import { gsap } from './smooth';

type Veil = { PEAK: number; build: () => void; draw: (blue: number, paper: number) => void };

const KEY = 'pt';
const root = document.documentElement;
const canvas = document.querySelector<HTMLCanvasElement>('.pt')!;
const veil = (window as any).__pt as Veil;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = () => (window as any).__lenis;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp = (t: number) => Math.min(1, Math.max(0, t));

let leaving = false;
let frame = 0;
let markReady!: () => void;
/** Resolves once the page is visible (immediately when it wasn't entered through a transition). */
export const ready = new Promise<void>((r) => (markReady = r));

/** Run step(t) for t in 0..1 over `ms`, one veil frame per animation frame. */
function play(ms: number, step: (t: number) => void) {
  cancelAnimationFrame(frame);
  return new Promise<void>((done) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - start) / ms);
      step(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else done();
    };
    frame = requestAnimationFrame(tick);
  });
}

function hide() {
  cancelAnimationFrame(frame);
  canvas.classList.remove('on');
  root.classList.remove('pt-in');
}

function reveal() {
  canvas.classList.add('on');
  root.classList.remove('pt-in');
  setTimeout(() => { gsap.globalTimeline.resume(); markReady(); }, 120);
  // Paper drops away first; the ink lingers a little longer, then thins out too.
  play(900, (t) => veil.draw(veil.PEAK * (1 - easeInOut(t)), 1 - easeInOut(clamp(t / 0.7)))).then(hide);
}

function leave(url: string) {
  leaving = true;
  lenis()?.stop();
  try { sessionStorage.setItem(KEY, String(Date.now())); } catch {}
  veil.build(); // fresh for the current viewport, so it matches what the next page draws
  canvas.classList.add('on');
  play(650, (t) => veil.draw(veil.PEAK * easeInOut(clamp(t / 0.8)), easeInOut(t))).then(() => location.assign(url));
}

if (root.classList.contains('pt-in')) {
  gsap.globalTimeline.pause();
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 500))]).then(() => requestAnimationFrame(reveal));
} else {
  markReady();
}

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

// Back/forward restores this page from bfcache with the veil still down: put it away.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  leaving = false;
  hide();
  gsap.globalTimeline.resume();
  lenis()?.start();
});
