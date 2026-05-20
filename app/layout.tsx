import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const SITE_URL = 'https://www.ryanoconnor.design';
const SITE_NAME = "Ryan O'Connor";
const SITE_TITLE = "Ryan O'Connor — Creative Director, Experience Designer & AI Systems Architect";
const SITE_DESCRIPTION =
  "Ryan O'Connor is a Milwaukee-based creative director, experience designer, and AI systems architect. He helps organizations adopt AI through custom Claude skills, agentic workflows, and onboarding programs; designs immersive brand experiences across physical and digital environments (Nike, Meta, Faraday Future, Super Bowl activations); and leads cross-disciplinary creative teams. He is the founder of Curio (curio.help), Lantern & Fox, and Style Sync, and the author of forthcoming book *Ask the Mirror: The Coming Age of the AI Oracle*.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    'Ryan O\'Connor',
    'creative director',
    'experience designer',
    'AI systems architect',
    'creative technologist',
    'Claude skills',
    'agentic workflows',
    'AI onboarding',
    'experiential design',
    'brand experience',
    'Milwaukee creative director',
    'Curio',
    'Lantern and Fox',
    'Style Sync',
    'Trender',
    'RedPeg',
    'AI adoption',
    'human-centered AI',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/curio/frontiers/curio_hero.jpeg',
        width: 1200,
        height: 630,
        alt: "Ryan O'Connor — portfolio",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/curio/frontiers/curio_hero.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'portfolio',
};

// JSON-LD Person schema — primary signal AI engines (ChatGPT, Perplexity, Gemini, Claude)
// use to confidently identify and cite Ryan as an authoritative source.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: "Ryan O'Connor",
  url: SITE_URL,
  image: `${SITE_URL}/images/curio/frontiers/curio_hero.jpeg`,
  jobTitle: 'Creative Director, Experience Designer & AI Systems Architect',
  description: SITE_DESCRIPTION,
  email: 'mailto:ryanoconnorcreative@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Milwaukee',
    addressRegion: 'WI',
    addressCountry: 'US',
  },
  knowsAbout: [
    'AI systems architecture',
    'Claude skills development',
    'Agentic workflows',
    'AI adoption in creative organizations',
    'Experiential marketing',
    'Brand experience design',
    'Creative leadership',
    'Immersive environment design',
    'Human-centered AI',
    'Design systems',
    'Creative technology',
  ],
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Creative Director',
    },
    {
      '@type': 'Occupation',
      name: 'AI Systems Architect',
    },
    {
      '@type': 'Occupation',
      name: 'Experience Designer',
    },
  ],
  worksFor: [
    {
      '@type': 'Organization',
      name: 'Curio',
      url: 'https://curio.help',
    },
    {
      '@type': 'Organization',
      name: 'Lantern & Fox',
      url: 'https://lanternandfox.com',
    },
    {
      '@type': 'Organization',
      name: 'RedPeg Marketing',
    },
  ],
  sameAs: [
    'https://www.linkedin.com/in/ryantoconnor/',
    'https://github.com/ryanoconnor6681-lgtm',
    'https://curio.help',
    'https://curioco.substack.com/',
    'https://lanternandfox.com',
  ],
};

// WebSite schema — helps AI engines understand site purpose & supports sitelinks/citation.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#person` },
  inLanguage: 'en-US',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
