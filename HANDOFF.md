# Handoff: havik.space

Personal portfolio for Havik (Hanoi): music · visual · marketing. Owner writes in Vietnamese; reply in Vietnamese.

## Stack & deploy
- Astro 7 static, GSAP (Lenis and ScrollTrigger removed with the paged layout), fonts Big Shoulders Display (titles, bold 700–800) + JetBrains Mono. `scopedStyleStrategy: 'class'` so a page's scoped styles reach the components it passes `class` to (Frame); style a Frame's inner box with `:global(.inner-class)`.
- Repo `synchromancer203-beep/havik-space`, push to `main` → GitHub Actions → Pages → https://havik.space (DNS at Spaceship, HTTPS on).
- Bilingual: EN (default) at `/`, VN at `/vi/` (owner switched the default to EN; old `/en/...` URLs redirect via `redirects` in `astro.config.mjs`). UI strings `src/i18n/ui.ts`, helpers `src/i18n/utils.ts`.
- Pages are thin wrappers in `src/pages/**` → views in `src/views/*`.

## Content
- Works: `src/content/works/<slug>/index.md` (+ cover, g01… gallery). Schema `src/content.config.ts`. `featured: true` → home "Nổi bật". EN text is a draft.
- Specialties copy: `src/data/specialties.ts`. About copy: `src/data/about.ts`.
- Raw source material (`E:\Web cá nhân\content`, style-guide.md, motion-guide.md, sitemap.md) lives only on the owner's PC, not in this repo.

## Done
- Phase 0–3: infra, layout/i18n, home, `/specialties` + 3 sub-pages, `/about`, `/media`, 404, privacy.
- **Paged layout (frames)**, owner request: every page is a stack of full-screen frames (`src/components/Frame.astro`, engine `src/scripts/frames.ts`).
  - One wheel flick / swipe / key (↓ PgDn Space, ↑ PgUp Shift+Space, Home/End) = one frame. The next frame slides up over the current one, which recedes (scale .92, darkens via `--shade`), expo.out ~1.15s. A trackpad's decaying tail doesn't count as a new gesture.
  - A frame taller than the screen scrolls inside first (`.frame-in`), then hands over on a fresh gesture. Lay content out to fit 100svh (`min(…vw, …vh)` type sizes, `justify-content: safe center`).
  - Entrances: `data-enter` (drifts up) and `data-enter="rise"` (masked `.line > span`), played each time a frame arrives (not on the first frame at load, which stays CSS-only for LCP).
  - `#id` links jump to the frame holding the id (the footer is every page's last frame, `#contact`). The current frame is kept in `history.state.frame`; tabbing into another frame brings it on screen. Far frames are parked at ±1000% so their lazy images don't load yet; nothing is hidden from assistive tech.
  - `html.paged` is set by the inline head script (not under reduced motion; dropped after 4s if the engine never starts). Without it, frames are ordinary 100svh sections in a normally scrolling page.
  - Header listens to `frames:update` / `frames:settle` for its on-blue probe.
  - Frame plan: Home = hero · fields collage · one per featured work · footer. About = portrait + lead · bio · work · education + certificates · highlights + photos · skills. Specialties = title + index · one per field · combined. Specialty = head + image · services (visual: one per group) · skills/people · works, 4 per frame · actions + next field. Media = fixed tab bar (+ group jumps); per tab an index frame, then per work a cover frame (image + details) and gallery frames (1–3 images packed by aspect ratio ≤ 2.6, contained, never cropped); `?work=` jumps to the cover; the lightbox is gone.
- No `/contact` page by owner's choice: email + social icons in footer (`#contact`). Contact/CTA links are a bare `#contact` (nav path too), so they scroll to the footer of the page you are on.
- Phase 4: page transitions. `src/scripts/transition.ts` + `.pt` layer in `Base.astro` (paper bg + canvas). Internal link click → paper layer fades in (0.18s) while a band of fine Vivid Blue riso stipple (white-noise grain, sparse leading edge, dense core; never a solid blue screen) sweeps top → bottom (0.4s). Navigation starts when the band's core nears the bottom (`NAV_AT`); the old page keeps animating until the next is ready. With cross-document View Transitions (Chromium/Safari) the browser crossfades (0.3s) from that frame straight onto the new page; the inline `<head>` script drops the cover on `pagereveal`. Without VT (or if the browser skips it) the next page paints under the paper (sessionStorage flag) and it fades out (0.24s). GSAP global timeline is paused until reveal. Astro prefetch on hover. Skipped for reduced motion, new-tab/modifier clicks, external/mailto, same-page hashes and anything inside `[data-no-transition]` (the footer: owner wants transitions from the header only). bfcache restore resets the layer. Note: headless Chromium skips cross-doc VT at random (~50%); the fallback covers it.
- Dock removed by owner's choice (header is always visible).
- Phase 5 (SEO/perf): per-page meta description + OG label in `src/data/seo.ts` (owner to review; EN/VN), share images built at `/og/<lang>/<slug>.png` by `src/pages/og/[...slug].png.ts` + `src/lib/og.ts` (satori + resvg; Vivid Blue plate, paper riso grain, Big Shoulders from `src/assets/fonts/big-shoulders-display-800.ttf` = fontsource latin+latin-ext+vietnamese 800 merged with fontTools so Vietnamese marks render). Base adds og:image/site_name/locale:alternate, twitter card, Person JSON-LD on home, `noindex` prop (404). `@astrojs/sitemap` with hreflang (excludes /en/ redirects, 404), `public/robots.txt`. Cloudflare Web Analytics: set `site.cfBeacon` in `src/i18n/ui.ts` (empty = off; privacy page mentions it only when set). Lighthouse (local, simulated mobile): perf 92–99 mobile / 100 desktop, a11y 95–100, BP 100, SEO 100. Perf fixes: home hero entrance is CSS (not GSAP) so the name paints without waiting for JS; stylesheets inlined; display font preloaded; hero image gets 480/800 widths.
- Known a11y contrast flags kept by design (owner rules): menu numbers #a9a9b3, white text on orange buttons.

## Design rules (owner feedback — keep)
- Colours only from style guide: paper bg `#F2F2F4` with very subtle gradients, Deep Blue `#202030` text, Vivid Blue `#4737FF` accent, Vivid Orange `#F75C03` ~10% (CTAs).
- Minimal, visual-first. No slogans/taglines, no decorative meta (coordinates, `/05` labels), no grid-tile bg, no pixelation.
- Risograph one-ink (component `Ink.astro`, Vivid Blue) ONLY on hero + personal photos. Work images: true colour, never cropped (keep original ratio).
- Motion is scroll/gesture-driven and paged (one frame per scroll), not hover-driven. Hermes site = riso technique reference only, not its colours.
- Menu numbering `1. 2. 3.`, same size as labels, light grey.
- Vietnamese diacritics: heading masks (`.line`) have top padding — keep it.

## Next
- Cloudflare Web Analytics token (owner, later); owner review of `src/data/seo.ts`; submit `sitemap-index.xml` in Google Search Console.
- Missing data: year + credit for the 2 websites (pccc-truc-binh, thanh-loi-dental), iMind cover image, owner review of all EN text and 3 inferred skills (Mixing & Mastering, Sound Design, Illustration).
