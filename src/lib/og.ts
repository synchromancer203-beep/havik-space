// Share (OG) images, 1200×630, rendered at build time: Vivid Blue plate, a band of paper-coloured
// riso grain thinning down from the top edge (same stipple as the page transition), the page label
// in Big Shoulders, and the wordmark. satori lays out and outlines the text, resvg rasterises.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const BLUE = [0x47, 0x37, 0xff];
const PAPER = [0xf2, 0xf2, 0xf4];

const require = createRequire(import.meta.url);
const fonts = [
  {
    // fontsource's latin + latin-ext + vietnamese 800 subsets merged into one file (fontTools), so
    // satori never mixes subsets inside a word (Ư, Ử, Ề rendered as tofu or with loose marks).
    name: 'Big Shoulders', weight: 800 as const, style: 'normal' as const,
    data: readFileSync(resolve('src/assets/fonts/big-shoulders-display-800.ttf')), // from the project root: the build runs there
  },
  {
    name: 'JetBrains Mono', weight: 400 as const, style: 'normal' as const, // only "havik.space": latin is enough
    data: readFileSync(require.resolve('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff')),
  },
];

let plate: Promise<string> | undefined;
/** The blue plate with its grain band, as a PNG data URI (built once, seeded so builds match). */
function getPlate() {
  return (plate ??= (async () => {
    const cell = 2;
    const cw = W / cell, ch = H / cell;
    const px = Buffer.alloc(W * H * 3);
    let seed = 0x2f6b9a1d;
    const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
    for (let cy = 0; cy < ch; cy++) {
      const u = cy / (ch * 0.42); // band covers the top 42%, densest at the edge
      const density = u >= 1 ? 0 : 0.85 * (1 - u) ** 1.8;
      for (let cx = 0; cx < cw; cx++) {
        const c = rnd() < density ? PAPER : BLUE;
        for (let y = cy * cell; y < cy * cell + cell; y++)
          for (let x = cx * cell; x < cx * cell + cell; x++) px.set(c, (y * W + x) * 3);
      }
    }
    const png = await sharp(px, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  })());
}

type Node = { type: string; props: Record<string, any> };
const h = (type: string, style: Record<string, any>, children?: (Node | string)[] | Node | string): Node => ({
  type, props: { style, children },
});

export async function renderOg({ label, isHome }: { label: string; isHome: boolean }) {
  const size = isHome ? 300 : label.length > 10 ? 150 : 190;
  // Absolute insets rather than padding: satori adds padding outside the declared size.
  const tree = h('div', {
    width: W, height: H, display: 'flex', position: 'relative',
    backgroundImage: `url(${await getPlate()})`, backgroundSize: `${W}px ${H}px`,
    color: '#ffffff', fontFamily: 'Big Shoulders',
  }, [
    h('div', { position: 'absolute', left: 64, right: 64, bottom: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }, [
      h('div', { display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.01em' },
        isHome ? [label, h('span', { color: '#f75c03' }, '.')] : label),
      isHome
        ? h('div', { fontFamily: 'JetBrains Mono', fontSize: 26, letterSpacing: '0.08em', paddingBottom: 6 }, 'havik.space')
        : h('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingBottom: 6 }, [
            h('div', { fontSize: 64, fontWeight: 800, lineHeight: 1, display: 'flex' }, ['HAVIK', h('span', { color: '#f75c03' }, '.')]),
            h('div', { fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: '0.08em', marginTop: 8 }, 'havik.space'),
          ]),
    ]),
  ]);
  const svg = await satori(tree as any, { width: W, height: H, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}
