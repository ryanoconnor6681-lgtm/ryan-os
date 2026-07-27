/** @type {import('next').NextConfig} */

// Files under public/ default to `max-age=0, must-revalidate` on Vercel, so
// every repeat visit to curio.help re-validated all 17 illustrations. Thirty
// days rather than a year with `immutable`: the art does get replaced in place
// from time to time, and a year-long immutable cache would strand visitors on
// the old version. To force a refresh sooner, rename the file or add ?v=N.
const ASSET_CACHE = 'public, max-age=2592000, stale-while-revalidate=86400';
const CODE_CACHE = 'public, max-age=3600, must-revalidate';

const nextConfig = {
  allowedDevOrigins: ['192.168.1.181', 'localhost'],

  async headers() {
    return [
      {
        // Both spellings: middleware rewrites curio.help/assets/* into
        // /curio-site/assets/*, and the portfolio serves that path directly.
        source: '/curio-site/assets/:path*',
        headers: [{ key: 'Cache-Control', value: ASSET_CACHE }],
      },
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: ASSET_CACHE }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: ASSET_CACHE }],
      },
      {
        // Stylesheets and scripts are cache-busted with ?v=N in the markup,
        // but they are also hand-edited, so keep the window short.
        //
        // Both spellings again, and note these match the *incoming* path:
        // Next evaluates headers() before the middleware rewrite, so on
        // curio.help the stylesheet arrives as /curio-overrides.css, not
        // /curio-site/curio-overrides.css.
        source: '/:file(.*\\.(?:css|js))',
        headers: [{ key: 'Cache-Control', value: CODE_CACHE }],
      },
      {
        source: '/curio-site/:file(.*\\.(?:css|js))',
        headers: [{ key: 'Cache-Control', value: CODE_CACHE }],
      },
    ];
  },
};

export default nextConfig;
// Force rebuild timestamp: 2026-01-27
