import { getAllPostsMeta } from '@/lib/posts';
import { siteMetadata } from '@/lib/siteMetadata';

type SitemapRoute = {
  url: string;
  lastModified?: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
};

/**
 * Generates a sitemap.xml file containing all published blog posts and static routes.
 */
export async function GET() {
  console.log('[Sitemap] Generating sitemap...');

  try {
    const posts = await getAllPostsMeta();
    const siteUrl = siteMetadata.siteUrl;

    const staticRoutes: SitemapRoute[] = [
      { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
      // todo: add other static pages like /about, /contact
    ];

    const postRoutes = posts
      .filter(post => post.slug && post.date)
      .map((post) => ({
        url: `${siteUrl}/posts/${post.slug}`,
        lastModified: post.lastModified
          ? new Date(post.lastModified).toISOString().split('T')[0]
          : new Date(post.date).toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    const allRoutes = [...staticRoutes, ...postRoutes];

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
        .map(
          (route) => `
    <url>
      <loc>${route.url}</loc>
      ${route.lastModified ? `<lastmod>${route.lastModified}</lastmod>` : ''}
      <changefreq>${route.changeFrequency}</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `
        )
        .join('')}
</urlset>`;

    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour // todo: update caching?
      },
    });
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    return new Response('Error generating sitemap', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
