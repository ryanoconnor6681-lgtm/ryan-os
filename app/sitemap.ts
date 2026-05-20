import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = 'https://www.ryanoconnor.design';
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/curio`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
