import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge middleware runs BEFORE Next.js static prerenders, so it can
// host-route curio.help → /curio-site/* even though the portfolio
// has a prerendered home page at /. Vercel.json rewrites can't do
// this — they lose to Next.js prerender priority.
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const isCurioHost = host === 'curio.help' || host === 'www.curio.help';

  if (!isCurioHost) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  // /api/* must reach the Next.js handler (powers the Ask-Curio chat).
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Root → /curio-site/index.html (explicit so static-file lookup hits)
  if (url.pathname === '/' || url.pathname === '') {
    url.pathname = '/curio-site/index.html';
    return NextResponse.rewrite(url);
  }

  const path = url.pathname.replace(/\/+$/, '');

  // Directory-style routes (/about, /quiz, /the-mirror) resolve to the
  // index.html inside them. Vercel's static layer already does this on its
  // own — these URLs work in production — but `next start` does not, so
  // spelling it out lets a local build reproduce production exactly.
  // Only the last segment decides, so a dot in a folder name can't make a
  // directory look like a file.
  const lastSegment = path.slice(path.lastIndexOf('/') + 1);
  if (!lastSegment.includes('.')) {
    url.pathname = `/curio-site${path}/index.html`;
    return NextResponse.rewrite(url);
  }

  // Everything else (a real file: .html, .css, .js, .webp, …)
  url.pathname = `/curio-site${path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals + favicon. Match everything else.
  matcher: '/((?!_next/static|_next/image|favicon\\.ico).*)',
};
