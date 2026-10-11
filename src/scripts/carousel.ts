// Gallery carousel (views/Media.astro). A work's images are laid out in 1–3 rows (by count and
// screen), every image at its own aspect ratio, and the rows run sideways without end. Drag with
// the mouse, swipe sideways on touch, or scroll sideways (trackpad, Shift + wheel) to move it;
// a release keeps some momentum. Vertical gestures are left to the frames (scripts/frames.ts).
// If everything already fits, the rows just sit centred and nothing moves.

const mobile = matchMedia('(max-width: 767px)');
const rowsFor = (n: number) => (mobile.matches ? (n < 10 ? 2 : 3) : n < 5 ? 1 : n <= 12 ? 2 : 3);
const mod = (a: number, n: number) => ((a % n) + n) % n;

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

  constructor(track: HTMLElement) {
    this.track = track;
    this.items = [...track.querySelectorAll<HTMLElement>('.g-thumb')];
    this.bind();
  }

  /** Spread the images over the rows (each to the currently shortest row, so rows end level),
   *  then repeat each row's run until it covers the track plus one more run. */
  build() {
    const n = this.items.length;
    const R = Math.min(rowsFor(n), n);
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
    this.loop = W > 0 && Math.max(...this.lens) - 1 > W;
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
    this.render();
  }

  render() {
    this.rows.forEach((r, k) => {
      r.style.transform = this.loop ? `translate3d(${-mod(this.x, this.lens[k])}px,0,0)` : '';
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
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      t.classList.remove('is-dragging');
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
