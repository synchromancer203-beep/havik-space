// Gallery carousel (views/Media.astro). A work's images are laid out in 1–3 rows (by count and
// screen), every image at its own aspect ratio, and the rows run sideways without end. Drag with
// the mouse, swipe sideways on touch, or scroll sideways (trackpad, Shift + wheel) to move it;
// a release keeps some momentum. Vertical gestures are left to the frames (scripts/frames.ts).
// If everything already fits, the rows just sit centred and nothing moves.
// A track can fix its row count (data-rows) and drift on its own like a conveyor (data-auto, px
// per frame); the drift pauses under the mouse, while dragging and for a moment after a gesture.
// It can also have a focal point (data-focus / data-focus-m on phones: a fraction of the track's
// width): the item passing it grows by data-zoom / data-zoom-m, easing in and out as it moves.
// What grows is the item's [data-zoom-target] (its cover), from its bottom edge.

const mobile = matchMedia('(max-width: 767px)');
const rowsFor = (n: number) => (mobile.matches ? (n < 10 ? 2 : 3) : n < 5 ? 1 : n <= 12 ? 2 : 3);
const mod = (a: number, n: number) => ((a % n) + n) % n;
const still = matchMedia('(prefers-reduced-motion: reduce)');

class Carousel {
  track: HTMLElement;
  items: HTMLElement[];
  rows: HTMLElement[] = [];
  lens: number[] = [];
  loop = false;
  x = 0;
  v = 0;
  raf = 0;
  /** Set while a drag is moving, so the click that ends it doesn't open the viewer. */
  dragged = false;
  /** Conveyor drift, px per frame (0 = off), and what holds it: a pointer over or on the track,
   *  or a recent gesture. */
  auto: number;
  held = false;
  rest = 0;
  /** Focal point (px from the track's left) and how much the item there grows; per row, every
   *  item's centre at rest and its width plus the gap, and the element that grows. */
  fx = 0;
  zoom = 0;
  spots: { c: number; w: number; bw: number; it: HTMLElement; el: HTMLElement; s: number; z: string; dx: number }[][] = [];

  constructor(track: HTMLElement) {
    this.track = track;
    this.items = [...track.querySelectorAll<HTMLElement>('.g-thumb')];
    this.auto = still.matches ? 0 : Number(track.dataset.auto) || 0;
    this.bind();
    if (this.auto) this.drift();
  }

  drift() {
    const step = (t: number) => {
      const shown = this.track.closest('.frame')?.classList.contains('is-current') ?? true;
      if (this.loop && shown && !this.held && t > this.rest) this.move(this.auto);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** Hold the drift for a moment after a gesture. */
  pause() { this.rest = performance.now() + 1800; }

  /** Spread the images over the rows (each to the currently shortest row, so rows end level),
   *  then repeat each row's run until it covers the track plus one more run. */
  build() {
    const n = this.items.length;
    const R = Math.min(Number(this.track.dataset.rows) || rowsFor(n), n);
    const sums = new Array(R).fill(0);
    this.rows = Array.from({ length: R }, () => {
      const r = document.createElement('div');
      r.className = 'g-row';
      return r;
    });
    this.items.forEach((it) => {
      const k = sums.indexOf(Math.min(...sums));
      sums[k] += Number(it.dataset.a);
      this.rows[k].append(it);
    });
    this.track.replaceChildren(...this.rows);

    const W = this.track.clientWidth;
    this.lens = this.rows.map((r) => {
      const kids = [...r.children] as HTMLElement[];
      const gap = parseFloat(getComputedStyle(r).columnGap) || 0;
      return kids.reduce((s, k) => s + k.offsetWidth + gap, 0);
    });
    // A conveyor always runs, repeating its items if they don't fill the track on their own.
    this.loop = W > 0 && (Math.max(...this.lens) - 1 > W || this.auto > 0);
    this.track.classList.toggle('is-loop', this.loop);
    if (this.loop) {
      this.rows.forEach((r, k) => {
        const run = [...r.children];
        for (let covered = this.lens[k]; covered < W + this.lens[k]; covered += this.lens[k]) {
          run.forEach((it) => {
            const c = it.cloneNode(true) as HTMLElement;
            c.classList.add('is-clone');
            c.setAttribute('aria-hidden', 'true');
            c.tabIndex = -1;
            r.append(c);
          });
        }
      });
    }
    this.measure();
    this.render();
  }

  /** Where each item sits at rest, for the focal zoom. */
  measure() {
    const d = this.track.dataset;
    const f = Number((mobile.matches && d.focusM) || d.focus) || 0;
    this.zoom = f ? Number((mobile.matches && d.zoomM) || d.zoom) || 0 : 0;
    if (!this.zoom) { this.spots = []; return; }
    const tr = this.track.getBoundingClientRect();
    this.fx = tr.width * f;
    this.spots = this.rows.map((r) => {
      const gap = parseFloat(getComputedStyle(r).columnGap) || 0;
      return ([...r.children] as HTMLElement[]).map((it) => {
        const b = it.getBoundingClientRect();
        const el = it.querySelector<HTMLElement>('[data-zoom-target]') ?? it;
        el.style.transform = ''; // clones copy the original's inline zoom
        el.style.zIndex = '';
        it.style.translate = '';
        return { c: b.left - tr.left + b.width / 2, w: b.width + gap, bw: b.width, it, el, s: 1, z: '', dx: 0 };
      });
    });
  }

  render() {
    this.rows.forEach((r, k) => {
      const shift = this.loop ? mod(this.x, this.lens[k]) : 0;
      r.style.transform = this.loop ? `translate3d(${-shift}px,0,0)` : '';
      // Focal zoom: full at the focal point, easing (cosine) to none one item away. The items
      // around it move apart by what it gains, so every gap stays the same.
      const sp = this.spots[k];
      if (!sp?.length) return;
      let extra = 0;
      sp.forEach((p) => {
        const dist = Math.abs(p.c - shift - this.fx) / p.w;
        p.s = 1 + (dist < 1 ? this.zoom * (1 + Math.cos(Math.PI * dist)) / 2 : 0);
        extra += (p.s - 1) * p.bw;
      });
      let before = 0;
      sp.forEach((p) => {
        const grow = (p.s - 1) * p.bw;
        const dx = before + grow / 2 - extra / 2;
        before += grow;
        const z = p.s > 1 ? `scale(${p.s.toFixed(4)})` : '';
        if (p.z !== z) {
          p.z = z;
          p.el.style.transform = z;
          p.el.style.zIndex = p.s > 1.005 ? '1' : '';
        }
        if (Math.abs(dx - p.dx) > 0.05) {
          p.dx = dx;
          p.it.style.translate = dx ? `${dx.toFixed(2)}px 0` : '';
        }
      });
    });
  }

  move(dx: number) {
    if (!this.loop) return;
    this.x += dx;
    this.render();
  }

  /** Momentum after a release: px per frame, decaying. */
  glide() {
    cancelAnimationFrame(this.raf);
    const step = () => {
      this.v *= 0.94;
      if (Math.abs(this.v) < 0.2) return;
      this.move(this.v);
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  bind() {
    const t = this.track;
    let id = -1;
    let sx = 0;
    let sy = 0;
    let lx = 0;
    let lt = 0;
    let axis: '' | 'x' | 'y' = '';

    t.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') this.held = true; });
    t.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') this.held = false; });
    t.addEventListener('pointerdown', (e) => {
      if (!this.loop || (e.pointerType === 'mouse' && e.button !== 0)) return;
      cancelAnimationFrame(this.raf);
      id = e.pointerId;
      sx = lx = e.clientX;
      sy = e.clientY;
      lt = e.timeStamp;
      this.v = 0;
      axis = '';
      this.dragged = false;
    });
    t.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      if (!axis) {
        const ax = Math.abs(e.clientX - sx);
        const ay = Math.abs(e.clientY - sy);
        if (ax < 6 && ay < 6) return;
        axis = ax > ay ? 'x' : 'y';
        if (axis === 'y') { id = -1; return; } // a vertical swipe: the frames take it
        t.setPointerCapture(id);
        t.classList.add('is-dragging');
        this.dragged = true;
      }
      const dx = lx - e.clientX;
      const dt = Math.max(1, e.timeStamp - lt);
      this.v = (dx / dt) * 16; // per ~frame
      lx = e.clientX;
      lt = e.timeStamp;
      this.move(dx);
      this.pause();
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      t.classList.remove('is-dragging');
      this.pause();
      if (axis === 'x' && e.timeStamp - lt < 80) this.glide();
    };
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
    // Swallow the click that ends a drag.
    t.addEventListener('click', (e) => {
      if (this.dragged) { e.stopPropagation(); e.preventDefault(); this.dragged = false; }
    }, true);
    t.addEventListener('dragstart', (e) => e.preventDefault());

    // Sideways scrolling: trackpad swipes and Shift + wheel. Vertical scrolling bubbles on to
    // the frames.
    t.addEventListener('wheel', (e) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx || !this.loop) return;
      e.preventDefault();
      e.stopPropagation();
      cancelAnimationFrame(this.raf);
      this.pause();
      this.move(dx);
    }, { passive: false });

    // Keyboard: bring a focused thumbnail fully into view.
    t.addEventListener('focusin', (e) => {
      if (!this.loop) return;
      const r = (e.target as HTMLElement).getBoundingClientRect();
      const tr = t.getBoundingClientRect();
      if (r.left < tr.left) this.move(r.left - tr.left - 24);
      else if (r.right > tr.right) this.move(r.right - tr.right + 24);
    });
  }
}

const all = [...document.querySelectorAll<HTMLElement>('.g-track')].map((t) => new Carousel(t));

/** Lay out every visible carousel (call after showing a tab). */
export function layout() {
  all.forEach((c) => { if (c.track.offsetParent) c.build(); });
}

let timer = 0;
addEventListener('resize', () => { clearTimeout(timer); timer = window.setTimeout(layout, 150); });
