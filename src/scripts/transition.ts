// Page transitions. On an internal link click a Vivid Blue curtain rises over the page, then the
// browser navigates. The next page is flagged (sessionStorage, read by the inline script in
// Base's <head>) so it paints already covered; once fonts are in, the curtain lifts off upward.
// GSAP's global timeline is held while covered so each page's entrance plays as it is revealed.
// Cross-document View Transitions (global.css) keep the blue frame on screen between documents.
import { gsap } from './smooth';

const KEY = 'pt';
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const root = document.documentElement;
const curtain = document.querySelector<HTMLElement>('.pt')!;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = () => (window as any).__lenis;

let leaving = false;
let markReady!: () => void;
/** Resolves once the page is visible (immediately when it wasn't entered through a transition). */
export const ready = new Promise<void>((r) => (markReady = r));

function reveal() {
  curtain.getAnimations().forEach((a) => a.cancel());
  root.classList.remove('pt-in');
  curtain.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], { duration: 800, easing: EASE });
  setTimeout(() => { gsap.globalTimeline.resume(); markReady(); }, 120);
}

function leave(url: string) {
  leaving = true;
  lenis()?.stop();
  try { sessionStorage.setItem(KEY, String(Date.now())); } catch {}
  curtain.getAnimations().forEach((a) => a.cancel());
  curtain
    .animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 600, easing: EASE, fill: 'forwards' })
    .finished.then(() => location.assign(url), () => {});
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
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || 'noTransition' in a.dataset) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  // Same document (hash only): smooth.ts glides there instead.
  if (url.pathname === location.pathname && url.search === location.search) return;
  e.preventDefault();
  leave(url.href);
});

// Back/forward restores this page from bfcache with the curtain still down: put it away.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  leaving = false;
  curtain.getAnimations().forEach((a) => a.cancel());
  root.classList.remove('pt-in');
  gsap.globalTimeline.resume();
  lenis()?.start();
});
