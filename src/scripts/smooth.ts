// Site-wide inertial scroll (Lenis) wired into GSAP's ticker so ScrollTrigger stays in sync.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as any).__lenis = lenis;

  // Anchor links (e.g. "Hợp tác" → #contact) glide instead of jumping.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const el = document.querySelector(url.hash);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el as HTMLElement, { offset: -64, duration: 1.4 });
  });
}

export { gsap, ScrollTrigger };
