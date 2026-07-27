// Builds the curio.help social-share image and favicons.
//
// The share card is the existing Curio hero illustration, cropped to 1200x630.
// No text is baked in: og:title and og:description already supply the words on
// every platform, and the site's display face (Newsreader) isn't installed
// locally, so rendering type here would land off-brand.
//
// The favicon is the masthead mark itself — the amber dot on the navy stage —
// because it's the only element that stays legible at 16px.
//
//   node scripts/build-curio-social.mjs

import sharp from 'sharp';
import { statSync } from 'node:fs';

const HERO = 'public/images/curio/frontiers/curio_hero.jpeg';
const OUT = 'public/curio-site/assets';

// Straight from colors_and_type.css.
const NAVY = '#1a2238';
const AMBER = '#d49d3a';

const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`;

// ── Share card ────────────────────────────────────────────────────────────
// JPEG rather than WebP: og:image is read by scrapers, and several (older
// LinkedIn, some Slack unfurlers) still won't decode WebP.
await sharp(HERO)
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 86, progressive: true })
  .toFile(`${OUT}/curio-share.jpg`);

console.log(`curio-share.jpg   1200x630  ${kb(`${OUT}/curio-share.jpg`)}`);

// ── Favicons ──────────────────────────────────────────────────────────────
const mark = (size) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
     <rect width="64" height="64" rx="12" fill="${NAVY}"/>
     <circle cx="32" cy="32" r="13" fill="${AMBER}"/>
   </svg>`
);

for (const size of [32, 180, 512]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
  await sharp(mark(size)).png().toFile(`${OUT}/${name}`);
  console.log(`${name.padEnd(22)} ${size}x${size}  ${kb(`${OUT}/${name}`)}`);
}
