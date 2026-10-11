# Handoff: havik.space

Personal portfolio for Havik (Hanoi): music · visual · marketing. Owner writes in Vietnamese; reply in Vietnamese.

## Stack & deploy
- Astro 5 static, Lenis + GSAP ScrollTrigger, fonts Big Shoulders Display (titles, bold 700–800) + JetBrains Mono.
- Repo `synchromancer203-beep/havik-space`, push to `main` → GitHub Actions → Pages → https://havik.space (DNS at Spaceship, HTTPS on).
- Bilingual: VN at `/`, EN at `/en/`. UI strings `src/i18n/ui.ts`, helpers `src/i18n/utils.ts`.
- Pages are thin wrappers in `src/pages/**` → views in `src/views/*`.

## Content
- Works: `src/content/works/<slug>/index.md` (+ cover, g01… gallery). Schema `src/content.config.ts`. `featured: true` → home "Nổi bật". EN text is a draft.
- Specialties copy: `src/data/specialties.ts`. About copy: `src/data/about.ts`.
- Raw source material (`E:\Web cá nhân\content`, style-guide.md, motion-guide.md, sitemap.md) lives only on the owner's PC, not in this repo.

## Done
- Phase 0–3: infra, layout/i18n, `/media` (tabs `?tab=`, filters, masonry, lightbox, deep link `?work=<slug>`), home, `/specialties` + 3 sub-pages, `/about`, 404, privacy.
- No `/contact` page by owner's choice: email + social icons in footer (`#contact`). Contact/CTA links are a bare `#contact` (nav path too), so they scroll to the footer of the page you are on.
- Phase 4: page transitions. `src/scripts/transition.ts` + `.pt` curtain in `Base.astro`: internal link click → Vivid Blue curtain rises → navigate → next page paints covered (sessionStorage flag read by inline `<head>` script) → curtain lifts. GSAP global timeline is paused while covered so entrance tweens play on reveal; `ready` promise exported for things that must wait (Media deep-link lightbox). `@view-transition` keeps the frame between documents; Astro prefetch on hover. Skipped for reduced motion, new-tab/modifier clicks, external/mailto, same-page hashes; opt out per link with `data-no-transition`. bfcache restore resets the curtain.

## Design rules (owner feedback — keep)
- Colours only from style guide: paper bg `#F2F2F4` with very subtle gradients, Deep Blue `#202030` text, Vivid Blue `#4737FF` accent, Vivid Orange `#F75C03` ~10% (CTAs).
- Minimal, visual-first. No slogans/taglines, no decorative meta (coordinates, `/05` labels), no grid-tile bg, no pixelation.
- Risograph one-ink (component `Ink.astro`, Vivid Blue) ONLY on hero + personal photos. Work images: true colour, never cropped (keep original ratio).
- Motion is scroll-driven (ref marcuslorenzet.com), not hover-driven. Hermes site = riso technique reference only, not its colours.
- Menu numbering `1. 2. 3.`, same size as labels, light grey.
- Vietnamese diacritics: heading masks (`.line`) have top padding — keep it.

## Next
- Phase 5: SEO (meta per page, OG images, sitemap.xml, robots.txt), Lighthouse ≥90, analytics (Cloudflare/Umami).
- Missing data: year + credit for the 2 websites (pccc-truc-binh, thanh-loi-dental), iMind cover image, owner review of all EN text and 3 inferred skills (Mixing & Mastering, Sound Design, Illustration).
