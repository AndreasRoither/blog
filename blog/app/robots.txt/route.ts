import { siteMetadata } from '@/lib/siteMetadata'; // Adjust path if needed

/**
 * Generates and serves the robots.txt file for web crawlers.
 * 
 * This handler returns a plain text robots.txt file that:
 * - Allows all user agents to crawl the entire site // todo: add exclusion based on frontmatter
 * - Points to the sitemap location
 */
export async function GET() {
  const siteUrl = siteMetadata.siteUrl;

  const robotsContent = `
# Block AI training and scraping bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Block Google's AI training bots
User-agent: Google-Extended
Disallow: /

User-agent: GoogleOther
Disallow: /

# Block other AI/scraping bots
User-agent: PerplexityBot
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: FacebookBot
Disallow: /

# Allow legitimate search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# Default rule for other bots
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`.trim();

  return new Response(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=604800', // Cache for 7 days; maybe update
    },
  });
}