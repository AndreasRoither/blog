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