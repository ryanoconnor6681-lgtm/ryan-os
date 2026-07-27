// Re-runnable image pipeline for the curio.help static site.
//
// The originals in public/curio-site/assets/ are 1.7–3.1 MB each and render
// between 73px (floating eggs) and ~1400px (focus-page hero illustrations).
// That put the homepage at 37 MB across 17 requests. This writes right-sized
// WebP next to each original; the HTML/CSS point at the .webp.
//
// Originals stay in place as the source of truth — rerun this after replacing
// any of them. Sizes below are 2x the measured render width at a 1280 viewport.
//
//   node scripts/optimize-curio-assets.mjs

import sharp from 'sharp';
import { statSync, existsSync } from 'node:fs';
import path from 'node:path';

const ASSETS = 'public/curio-site/assets';

// [files, targetWidth, quality]
// Quality 90 for anything composited with mix-blend-mode: multiply — under
// multiply, compression noise in the near-white background becomes visible
// smudging on the cream card. The screen-blended eggs sit at opacity 0.14–0.20
// and hide artifacts, so 82 is plenty there.
const GROUPS = [
  {
    label: 'floating eggs (render 56–96px, screen blend @ 0.14–0.20 opacity)',
    width: 320,
    quality: 82,
    files: [
      'matches.png', 'mag.png', 'compass.png', 'cards_stack.png',
      'pocketwatch.png', 'fortune.png', 'redthread.png', 'bell.png',
    ],
  },
  {
    // Renders at most 820px, screen-blended at 0.55 opacity, so it is already
    // heavily diffused — it does not need retina-density detail.
    label: 'crystal ball (also a clamp(420px,60vw,820px) section backdrop)',
    width: 900,
    quality: 78,
    files: ['crystalball.png'],
  },
  {
    label: 'focus-card icons (render ~242px, multiply blend)',
    width: 640,
    quality: 90,
    files: ['icon-genie.png', 'icon-eye.png', 'icon-brain.png', 'icon-hand.png'],
  },
  {
    label: 'fallacy-card icons (render ~234px, multiply blend)',
    width: 640,
    quality: 90,
    files: [
      'fallacy-exhaustion.png', 'fallacy-guilt.png', 'fallacy-identity.png',
      'fallacy-muscle.png', 'yesterdayfallacy.png',
    ],
  },
  {
    label: 'focus-page hero illustrations (full-bleed)',
    width: 1800,
    quality: 84,
    files: [
      'illus-figure-sun-systems.jpeg', 'illus-hourglass-mind.jpeg',
      'illus-hand-brain-ribbons.jpeg', 'illus-human-robot-hands.jpeg',
    ],
  },
  {
    // Same heroes at phone size. They render ~342px wide on a 375px viewport,
    // so the 1800px file is ~5x more pixels than the screen can use. The
    // markup offers both via srcset and the browser picks.
    label: 'focus-page hero illustrations — phone variant',
    width: 800,
    quality: 82,
    suffix: '-800',
    files: [
      'illus-figure-sun-systems.jpeg', 'illus-hourglass-mind.jpeg',
      'illus-hand-brain-ribbons.jpeg', 'illus-human-robot-hands.jpeg',
    ],
  },
];

const kb = (n) => (n / 1024).toFixed(0).padStart(6);
let totalBefore = 0;
let totalAfter = 0;
let missing = 0;

for (const group of GROUPS) {
  console.log(`\n${group.label}  →  ${group.width}px, q${group.quality}`);
  for (const file of group.files) {
    const src = path.join(ASSETS, file);
    if (!existsSync(src)) {
      console.log(`  MISSING  ${file}`);
      missing++;
      continue;
    }
    const suffix = group.suffix || '';
    const out = path.join(ASSETS, file.replace(/\.(png|jpe?g)$/i, `${suffix}.webp`));
    await sharp(src)
      .resize({ width: group.width, withoutEnlargement: true })
      .webp({ quality: group.quality })
      .toFile(out);

    const before = statSync(src).size;
    const after = statSync(out).size;
    totalBefore += before;
    totalAfter += after;
    const cut = (100 - (after / before) * 100).toFixed(1);
    console.log(`  ${kb(before)} KB → ${kb(after)} KB  (${cut.padStart(4)}% smaller)  ${file}`);
  }
}

console.log('\n' + '─'.repeat(72));
console.log(
  `TOTAL  ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ` +
  `${(totalAfter / 1024).toFixed(0)} KB  ` +
  `(${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}% smaller)`
);
if (missing) {
  console.error(`\n${missing} source file(s) missing — references may 404.`);
  process.exit(1);
}
