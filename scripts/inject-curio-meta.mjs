// Injects description / canonical / OG / Twitter / favicon tags into the
// curio.help static pages.
//
// Before this, index.html and all four focus pages had a <title> and nothing
// else — no description, no OG image, no favicon, no canonical. Substack and
// LinkedIn are Curio's whole distribution, so every link posted there unfurled
// as a bare URL. Descriptions below are drawn from each page's own hero copy.
//
// Re-runnable: an existing injected block is stripped and rewritten.
//
//   node scripts/inject-curio-meta.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = 'public/curio-site';
const SITE = 'https://curio.help';
const MARKER = '<!-- curio:social -->';

// `assets` is the correct prefix to reach /curio-site/assets/ from each page.
// It differs per page and can't be inferred from <base> alone:
//   index + focus pages  → same folder            → assets/
//   about/  (<base href="/">)                     → /assets/
//   quiz/   (one level deep, no <base>)           → ../assets/
// Relative paths keep the pages working both at curio.help (via the middleware
// rewrite) and at ryanoconnor.design/curio-site/.
const PAGES = [
  {
    file: 'index.html',
    assets: 'assets',
    url: `${SITE}/`,
    // Mirrors the live <title> and masthead wording ("studio"), not the older
    // "a guide for the AI uncertain" tagline.
    title: 'Curio — a studio for figuring out what AI means for your work',
    description:
      "Free guide for people figuring out what AI means for their actual work. Four focuses to move toward, five fallacies that get in the way, and a 90-second quiz to find yours. No pitch, no paywall.",
  },
  {
    file: 'Inspiration.html',
    assets: 'assets',
    url: `${SITE}/Inspiration.html`,
    title: 'Inspiration — where this is all going · Curio',
    description:
      "You can feel the wave. You just can't yet see your part in it. The north-star focus: stop asking what to learn and ask what to become.",
  },
  {
    file: 'Filter.html',
    assets: 'assets',
    url: `${SITE}/Filter.html`,
    title: 'Filter — what to use, what to ignore · Curio',
    description:
      "Most of what's reaching you isn't AI, it's noise about AI. How to sort it, and why the missing thing is hierarchy rather than more information.",
  },
  {
    file: 'Mindset.html',
    assets: 'assets',
    url: `${SITE}/Mindset.html`,
    title: 'Mindset — for the plateau · Curio',
    description:
      "You haven't been doing it wrong. You've been using the smartest colleague you have like a calculator. For people already using AI who have stopped getting further.",
  },
  {
    file: 'Solutions.html',
    assets: 'assets',
    url: `${SITE}/Solutions.html`,
    title: 'Solutions — hand me the task · Curio',
    description:
      "Sometimes you don't need another framework. You need someone who has done this, and the permission to hand them the task. Help building, auditing, and thinking.",
  },
  {
    file: 'about/index.html',
    assets: '/assets',
    url: `${SITE}/about`,
    title: "About Curio — Ryan O'Connor",
    description:
      'Why Curio exists, and the experience behind it: fifteen years teaching, two years training AI inside a working agency.',
  },
  {
    file: 'quiz/index.html',
    assets: '../assets',
    url: `${SITE}/quiz`,
    title: 'The Curio Quiz — which fallacy is yours?',
    description:
      'A 90-second quiz that names which of the five fallacies is blocking you from AI fluency, then sends the Curio Starter. Free, no paywall.',
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function socialBlock({ url, title, description, assets }) {
  return `${MARKER}
<link rel="canonical" href="${url}" />
<meta name="description" content="${esc(description)}" />
<meta name="author" content="Ryan O'Connor" />
<link rel="icon" type="image/png" sizes="32x32" href="${assets}/favicon-32.png" />
<link rel="icon" type="image/png" sizes="512x512" href="${assets}/favicon-512.png" />
<link rel="apple-touch-icon" href="${assets}/apple-touch-icon.png" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Curio" />
<meta property="og:locale" content="en_US" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="${SITE}/assets/curio-share.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Halftone illustration of a genie rising from a canyon, ribbons of red and blue running across a cream field, with two small figures below" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE}/assets/curio-share.jpg" />
<meta name="theme-color" content="#1a2238" />`;
}

let done = 0;
for (const page of PAGES) {
  const file = path.join(ROOT, page.file);
  let html = readFileSync(file, 'utf8');

  // Re-runnable: strip a previously injected block so edits here take effect.
  if (html.includes(MARKER)) {
    html = html.replace(
      new RegExp(`[ \\t]*${MARKER}[\\s\\S]*?<meta name="theme-color"[^>]*>\\s*\\n`, 'i'),
      ''
    );
  }

  const block = socialBlock(page);

  // Drop any pre-existing description so we don't end up with two.
  html = html.replace(/^[ \t]*<meta\s+name="description"[^>]*>\s*\n/gim, '');

  // Insert just before the first stylesheet so the tags sit with the rest of
  // the head metadata rather than after the body-affecting links.
  const anchor = html.match(/^[ \t]*<link rel="stylesheet"/im);
  if (anchor) {
    html = html.replace(anchor[0], `${block}\n${anchor[0]}`);
  } else {
    html = html.replace(/<\/head>/i, `${block}\n</head>`);
  }

  writeFileSync(file, html);
  console.log(`${page.file.padEnd(22)} tagged`);
  done++;
}
console.log(`\n${done} page(s) updated`);
