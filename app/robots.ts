import type { MetadataRoute } from 'next';

// AIEO note: We explicitly allow every major AI crawler.
// Many AI engines treat "absence of explicit allow" as ambiguous and skip the site.
// If you ever want to opt OUT of training-data crawlers but stay IN AI search,
// see Anthropic / OpenAI docs — the "*-Extended" and training-specific bots are separate
// from the search-time bots (OAI-SearchBot, PerplexityBot, ClaudeBot for fetch).

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = 'https://www.ryanoconnor.design';

  const aiCrawlers = [
    'GPTBot',           // OpenAI training crawler
    'OAI-SearchBot',    // ChatGPT search-time crawler
    'ChatGPT-User',     // ChatGPT user-initiated fetch
    'ClaudeBot',        // Anthropic crawler
    'Claude-Web',       // Anthropic browse
    'anthropic-ai',     // legacy Anthropic identifier
    'PerplexityBot',    // Perplexity index
    'Perplexity-User',  // Perplexity user fetch
    'Google-Extended',  // Google's AI training opt-in flag
    'GoogleOther',      // Google AI products
    'Applebot-Extended',// Apple Intelligence training
    'Bytespider',       // ByteDance / Doubao
    'CCBot',            // Common Crawl (feeds many models)
    'cohere-ai',        // Cohere
    'Diffbot',          // structured data extractor used by many AI systems
    'FacebookBot',      // Meta AI
    'Meta-ExternalAgent',
    'Amazonbot',        // Alexa / Amazon AI
    'YouBot',           // You.com AI
    'DuckAssistBot',    // DuckDuckGo assist
    'Mistral-AI',
  ];

  return {
    rules: [
      // Global allow — standard SEO crawlers
      { userAgent: '*', allow: '/' },
      // Explicit allow for each AI crawler (sends a strong "yes you can cite me" signal)
      ...aiCrawlers.map((ua) => ({ userAgent: ua, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
