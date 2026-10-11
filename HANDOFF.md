# Handoff: havik.space

Personal portfolio for Havik (Hanoi): music · visual · marketing. Owner writes in Vietnamese; reply in Vietnamese.

## Stack & deploy
- Astro 5 static, Lenis + GSAP ScrollTrigger, fonts Big Shoulders Display (titles, bold 700–800) + JetBrains Mono.
- Repo `synchromancer203-beep/havik-space`, push to `main` → GitHub Actions → Pages → https://havik.space (DNS at Spaceship, HTTPS on).
- Bilingual: EN (default) at `/`, VN at `/vi/` (owner switched the default to EN; old `/en/...` URLs redirect via `redirects` in `astro.config.mjs`). UI strings `src/i18n/ui.ts`, helpers `src/i18n/utils.ts`.
- Pages are thin wrappers in `src/pages/**` → views in `src/views/*`.

## Content
- Works: `src/content/works/<slug>/index.md` (+ cover, g01… gallery). Schema `src/content.config.ts`. `featured: true` → home "Nổi bật". EN text is a draft.
- Specialties copy: `src/data/specialties.ts`. About copy: `src/data/about.ts`.
- Raw source material (`E:\Web cá nhân\content`, style-guide.md, motion-guide.md, sitemap.md) lives only on the owner's PC, not in this repo.

## Done
- Phase 0–3: infra, layout/i18n, `/media` (tabs `?tab=`, filters, masonry, lightbox, deep link `?work=<slug>`), home, `/specialties` + 3 sub-pages, `/about`, 404, privacy.
- No `/contact` page by owner's choice: email + social icons in footer (`#contact`). Contact/CTA links are a bare `#contact` (nav path too), so they scroll to the footer of the page you are on.
- Phase 4: page transitions. `src/scripts/transition.ts` + `.pt` layer in `Base.astro` (paper bg + canvas). Internal link click → paper layer fades in (0.18s) while a band of fine Vivid Blue riso stipple (white-noise grain, sparse leading edge, dense core; never a solid blue screen) sweeps top → bottom (0.4s). Navigation starts when the band's core nears the bottom (`NAV_AT`); the old page keeps animating until the next is ready. With cross-document View Transitions (Chromium/Safari) the browser crossfades (0.3s) from that frame straight onto the new page; the inline `<head>` script drops the cover on `pagereveal`. Without VT (or if the browser skips it) the next page paints under the paper (sessionStorage flag) and it fades out (0.24s). GSAP global timeline is paused until reveal; `ready` promise exported for things that must wait (Media deep-link lightbox). Astro prefetch on hover. Skipped for reduced motion, new-tab/modifier clicks, external/mailto, same-page hashes and anything inside `[data-no-transition]` (the footer: owner wants transitions from the header only). bfcache restore resets the layer. Note: headless Chromium skips cross-doc VT at random (~50%); the fallback covers it.
- Dock removed by owner's choice (header is always visible).
- Phase 5 (SEO/perf): per-page meta description + OG label in `src/data/seo.ts` (owner to review; EN/VN), share images built at `/og/<lang>/<slug>.png` by `src/pages/og/[...slug].png.ts` + `src/lib/og.ts` (satori + resvg; Vivid Blue plate, paper riso grain, Big Shoulders from `src/assets/fonts/big-shoulders-display-800.ttf` = fontsource latin+latin-ext+vietnamese 800 merged with fontTools so Vietnamese marks render). Base adds og:image/site_name/locale:alternate, twitter card, Person JSON-LD on home, `noindex` prop (404). `@astrojs/sitemap` with hreflang (excludes /en/ redirects, 404), `public/robots.txt`. Cloudflare Web Analytics: set `site.cfBeacon` in `src/i18n/ui.ts` (empty = off; privacy page mentions it only when set). Lighthouse (local, simulated mobile): perf 92–99 mobile / 100 desktop, a11y 95–100, BP 100, SEO 100. Perf fixes: home hero entrance is CSS (not GSAP) so the name paints without waiting for JS; stylesheets inlined; display font preloaded; hero image gets 480/800 widths.
- Known a11y contrast flags kept by design (owner rules): menu numbers #a9a9b3, white text on orange buttons.
