// Page transitions (~0.8s). On an internal link click a paper layer fades in over the page, then a
// band of fine Vivid Blue riso grain starts sweeping up from the bottom edge; with the band across
// the middle, the browser navigates. The next page is flagged (sessionStorage, read by the inline
// script in Base's <head>) so it paints the same mid-sweep frame; the band carries on off the
// top, then the paper fades away onto the new page. The grain is drawn by the inline renderer
// next to the layer in Base (window.__pt). GSAP's global timeline is held until the paper starts
// to fade, so each page's entrance plays as it is revealed. Cross-document View Transitions
// (global.css) keep the frame on screen between documents.
import { gsap } from './smooth';

type Sweep = { build: () => void; draw: (pos: number) => void };

const KEY = 'pt';
const root = document.documentElement;
const layer = document.querySelector<HTMLElement>('.pt')!;
const sweep = (window as any).__pt as Sweep;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = () => (window as any).__lenis;

// The band accelerates into the navigation and decelerates out of it at the same speed, so the
// two halves join without a jolt.
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

let leaving = false;
let frame = 0;
let markReady!: () => void;
/** Resolves once the page is visible (immediately when it wasn't entered through a transition). */
export const ready = new Promise<void>((r) => (markReady = r));

/** Run step(t) for t in 0..1 over `ms`, once per animation frame. */
function play(ms: number, step: (t: number) => void) {
  cancelAnimationFrame(frame);
  return new Promise<void>((done) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      step(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else done();
    };
    frame = requestAnimationFrame(tick);
  });
}

function hide() {
  cancelAnimationFrame(frame);
  layer.getAnimations().forEach((a) => a.cancel());
  layer.classList.remove('on');
  root.classList.remove('pt-in');
}

async function arrive() {
  layer.classList.add('on');
  root.classList.remove('pt-in');
  const fonts = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 500))]);
  await play(220, (t) => sweep.draw(0.5 + 0.5 * easeOut(t)));
  await fonts;
  gsap.globalTimeline.resume();
  markReady();
  layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease-in-out' }).finished.then(hide, () => {});
}

function leave(url: string) {
  leaving = true;
  lenis()?.stop();
  try { sessionStorage.setItem(KEY, String(Date.now())); } catch {}
  sweep.build(); // fresh for the current viewport, so it matches what the next page draws
  sweep.draw(0);
  layer.classList.add('on');
  layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
  setTimeout(() => play(220, (t) => sweep.draw(0.5 * easeIn(t))).then(() => location.assign(url)), 130);
}

if (root.classList.contains('pt-in')) {
  gsap.globalTimeline.pause();
  arrive();
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

// Back/forward restores this page from bfcache with the layer still up: put it away.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  leaving = false;
  hide();
  gsap.globalTimeline.resume();
  lenis()?.start();
});
