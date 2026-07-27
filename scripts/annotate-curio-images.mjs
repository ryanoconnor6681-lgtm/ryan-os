// Adds width/height/loading/decoding to every <img src="assets/*.webp"> in the
// curio.help static pages. Intrinsic dimensions stop layout shift as the art
// streams in; lazy-loading keeps the below-fold card icons off the critical path.
//
// The full-bleed focus-page hero illustrations are the opposite case — they are
// the first paint, so they load eager at high priority.
//
//   node scripts/annotate-curio-images.mjs

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = 'public/curio-site';
const PAGES = [
  'index.html',
  'about/index.html',
  'Inspiration.html',
  'Filter.html',
  'Mindset.html',
  'Solutions.html',
];

// Hero illustrations carry meaning, so they get real alt text. Everything else
// is decorative art beside a text label and correctly stays alt="".
const HERO_ALT = {
  'illus-figure-sun-systems':
    'Halftone illustration of a figure standing before concentric orbiting systems',
  'illus-hourglass-mind':
    'Halftone illustration of an hourglass holding a human profile',
  'illus-hand-brain-ribbons':
    'Halftone illustration of a hand and a brain joined by looping ribbons',
  'illus-human-robot-hands':
    'Halftone illustration of a human hand and a machine hand reaching toward each other',
};

const dims = new Map();
async function dimensionsFor(file) {
  if (!dims.has(file)) {
    const { width, height } = await sharp(path.join(ROOT, 'assets', file)).metadata();
    dims.set(file, { width, height });
  }
  return dims.get(file);
}

let touched = 0;
for (const page of PAGES) {
  const file = path.join(ROOT, page);
  let html = readFileSync(file, 'utf8');
  const tags = [...html.matchAll(/<img\s[^>]*src="assets\/([A-Za-z0-9_.-]+\.webp)"[^>]*>/g)];

  for (const [tag, asset] of tags) {
    // Idempotent: skip anything already annotated.
    if (/\swidth=/.test(tag)) continue;

    const { width, height } = await dimensionsFor(asset);
    const stem = asset.replace(/\.webp$/, '');
    const isHero = stem.startsWith('illus-');

    let next = tag;
    if (isHero && HERO_ALT[stem]) {
      next = next.replace('alt=""', `alt="${HERO_ALT[stem]}"`);
    }
    const attrs = isHero
      ? `width="${width}" height="${height}" loading="eager" fetchpriority="high" decoding="async"`
      : `width="${width}" height="${height}" loading="lazy" decoding="async"`;

    next = next.replace(/\s*\/?>$/, (end) => ` ${attrs}${end.trimStart()}`);
    html = html.replace(tag, next);
    touched++;
  }

  writeFileSync(file, html);
  console.log(`${page.padEnd(24)} ${tags.length} <img> tag(s)`);
}
console.log(`\nannotated ${touched} tag(s)`);
