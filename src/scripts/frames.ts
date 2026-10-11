// Paged scrolling. Every `.frame` (components/Frame.astro) is one screen; one wheel flick, swipe
// or key press moves exactly one frame. The next frame slides up over the current one, which
// recedes (shrinks, darkens) behind it; the move eases out so it settles gently. A frame taller
// than the screen scrolls inside first, then hands over to the next frame on a fresh gesture.
//
// Only active when the inline script in Base's <head> has set html.paged (not under reduced
// motion). Without it, frames are ordinary full-height sections in a normally scrolling page.
import { gsap } from './smooth';

const root = document.documentElement;
const DUR = 1.15;
const EASE = 'expo.out';
const RECEDE = { scale: 0.92, yPercent: -4, '--shade': 0.55 };

let frames: HTMLElement[] = [];
let index = 0;
let busy = false;
let lastWheel = 0;
let lastDelta = 0;
let lastInner = 0;

const inner = (f: HTMLElement) => f.querySelector<HTMLElement>(':scope > .frame-in')!;
/** Can the frame's own content still scroll in this direction? */
function canScroll(f: HTMLElement, dir: number) {
  const s = inner(f);
  // Frames that clip their content (the hero), and a few px of slack from an entrance still
  // settling, don't count as scrollable.
  if (s.scrollHeight - s.clientHeight <= 4 || getComputedStyle(s).overflowY === 'hidden') return false;
  return dir > 0 ? s.scrollTop + s.clientHeight < s.scrollHeight - 1 : s.scrollTop > 0;
}

/** Park every frame for the current index: current in place, the one before receded behind it,
 *  the one after waiting just below, the rest far away (so their lazy images don't load yet).
 *  Nothing is hidden, so assistive tech and Tab still reach every frame. */
function place() {
  frames.forEach((f, k) => {
    gsap.killTweensOf(f);
    const d = k - index;
    f.classList.toggle('is-current', d === 0);
    f.style.zIndex = d === 0 ? '2' : '1';
    // y: 0 clears the CSS parking offset, which GSAP would otherwise read as a pixel y.
    if (d === 0) gsap.set(f, { y: 0, yPercent: 0, scale: 1, '--shade': 0 });
    else if (d === -1) gsap.set(f, { y: 0, ...RECEDE });
    else if (d === 1) gsap.set(f, { y: 0, yPercent: 100, scale: 1, '--shade': 0 });
    else gsap.set(f, { y: 0, yPercent: d < 0 ? -1000 : 1000, scale: 1, '--shade': 0 });
  });
}

/** Entrance for what's inside a frame as it arrives: masked lines rise, marked items drift up. */
function enter(f: HTMLElement, delay = 0.18) {
  const lines = f.querySelectorAll('[data-enter="rise"] .line > span');
  const items = f.querySelectorAll('[data-enter]:not([data-enter="rise"])');
  if (lines.length) gsap.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', delay, stagger: 0.06 });
  if (items.length) gsap.fromTo(items, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: delay + 0.08, stagger: 0.07 });
}

function emit(type: string) {
  dispatchEvent(new CustomEvent(type, { detail: { index, frame: frames[index], count: frames.length } }));
}

function remember() {
  try { history.replaceState({ ...(history.state ?? {}), frame: index }, ''); } catch {}
}

/** Go to frame n. Neighbours slide; longer jumps bring the target in from below the same way. */
export function goTo(n: number, { instant = false } = {}) {
  n = Math.max(0, Math.min(frames.length - 1, n));
  if (n === index || !frames.length) return;
  const from = frames[index];
  const to = frames[n];
  const dir = n > index ? 1 : -1;
  const prev = index;
  index = n;
  remember();

  if (instant) {
    place();
    inner(to).scrollTop = 0;
    emit('frames:change');
    emit('frames:settle');
    return;
  }

  busy = true;
  frames.forEach((f) => gsap.killTweensOf(f));
  inner(to).scrollTop = dir > 0 ? 0 : inner(to).scrollTop;
  const tick = () => emit('frames:update');

  if (dir > 0) {
    // Forward: the target slides up over the current frame, which recedes.
    to.style.zIndex = '3';
    from.style.zIndex = '2';
    gsap.set(to, { yPercent: 100, scale: 1, '--shade': 0 });
    gsap.to(from, { ...RECEDE, duration: DUR, ease: EASE });
    gsap.to(to, { yPercent: 0, duration: DUR, ease: EASE, onUpdate: tick });
  } else {
    // Back: the current frame slides down off the target, which comes forward again.
    from.style.zIndex = '3';
    to.style.zIndex = '2';
    if (prev - n > 1) gsap.set(to, RECEDE);
    gsap.to(from, { yPercent: 100, duration: DUR, ease: EASE, onUpdate: tick });
    gsap.to(to, { yPercent: 0, scale: 1, '--shade': 0, duration: DUR, ease: EASE });
  }
  enter(to);
  emit('frames:change');
  // Accept the next gesture once the move has mostly settled; tidy up when it has fully.
  gsap.delayedCall(DUR * 0.55, () => { busy = false; });
  gsap.delayedCall(DUR, () => { place(); emit('frames:settle'); });
}

export const next = () => goTo(index + 1);
export const prev = () => goTo(index - 1);
export const current = () => index;
/** Index of the frame holding an element (or -1). */
export const frameOf = (el: Element | null) => frames.findIndex((f) => !!el && f.contains(el));

/** Re-read the frame list (e.g. after hiding/showing frames) and land on frame n. */
export function refresh(n = 0) {
  frames = [...document.querySelectorAll<HTMLElement>('.frame')].filter((f) => !f.hidden);
  index = Math.max(0, Math.min(frames.length - 1, n));
  place();
  emit('frames:change');
  emit('frames:settle');
}

function step(dir: number) {
  if (busy) return;
  dir > 0 ? next() : prev();
}

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return; // pinch-zoom
  const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0;
  if (!d) return;
  const dir = Math.sign(d);
  const now = performance.now();
  const f = frames[index];
  if (f && canScroll(f, dir)) { lastInner = now; lastWheel = now; lastDelta = d; return; } // let it scroll
  e.preventDefault();
  // One flick = one frame. A trackpad keeps sending a decaying tail of events after the
  // flick; only a pause or a clearly stronger push counts as a new gesture.
  const fresh = now - lastWheel > 180 || Math.abs(d) > Math.abs(lastDelta) * 1.4 + 4;
  lastWheel = now;
  lastDelta = d;
  if (!fresh || now - lastInner < 260 || Math.abs(d) < 3) return;
  step(dir);
}

let touchY = 0;
let touchX = 0;
let touchInner = false;
function onTouchStart(e: TouchEvent) {
  touchY = e.touches[0].clientY;
  touchX = e.touches[0].clientX;
  touchInner = false;
}
function onTouchMove(e: TouchEvent) {
  const dy = touchY - e.touches[0].clientY;
  const f = frames[index];
  if (f && canScroll(f, Math.sign(dy) || 1)) { touchInner = true; return; } // native scroll inside the frame
  if (e.cancelable) e.preventDefault();
}
function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0];
  const dy = touchY - t.clientY;
  if (touchInner || Math.abs(dy) < 48 || Math.abs(dy) < Math.abs(touchX - t.clientX)) return;
  step(Math.sign(dy));
}

function onKey(e: KeyboardEvent) {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, [contenteditable]')) return;
  if (document.querySelector('#mobile-menu:not([hidden])')) return;
  const f = frames[index];
  let dir = 0;
  if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) dir = 1;
  else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) dir = -1;
  else if (e.key === 'Home') { e.preventDefault(); return goTo(0); }
  else if (e.key === 'End') { e.preventDefault(); return goTo(frames.length - 1); }
  if (!dir) return;
  if (e.key === ' ' && t.closest('button, a, summary')) return;
  if (f && canScroll(f, dir)) return; // scroll inside the frame first
  e.preventDefault();
  step(dir);
}

// Same-page anchors (#contact → the footer frame) jump between frames instead of scrolling.
function onClick(e: MouseEvent) {
  const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href*="#"]');
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
  const k = frameOf(document.getElementById(decodeURIComponent(url.hash.slice(1))));
  if (k < 0) return;
  e.preventDefault();
  goTo(k);
}

// Tabbing into a frame that isn't on screen brings it on screen.
function onFocus(e: FocusEvent) {
  const k = frameOf(e.target as Element);
  if (k >= 0 && k !== index) goTo(k, { instant: Math.abs(k - index) > 1 });
}

if (root.classList.contains('paged')) {
  refresh(0);
  const fromHash = location.hash ? frameOf(document.getElementById(decodeURIComponent(location.hash.slice(1)))) : -1;
  const saved = typeof history.state?.frame === 'number' ? history.state.frame : -1;
  const start = fromHash >= 0 ? fromHash : saved;
  if (start > 0) goTo(start, { instant: true });
  root.classList.add('frames-on');

  addEventListener('wheel', onWheel, { passive: false });
  addEventListener('touchstart', onTouchStart, { passive: true });
  addEventListener('touchmove', onTouchMove, { passive: false });
  addEventListener('touchend', onTouchEnd, { passive: true });
  addEventListener('keydown', onKey);
  document.addEventListener('click', onClick);
  document.addEventListener('focusin', onFocus);
}
