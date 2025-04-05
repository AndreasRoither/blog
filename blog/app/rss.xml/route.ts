
import { getAllPostsMeta } from '@/lib/posts';
import { siteMetadata } from '@/lib/siteMetadata';
import RSS from 'rss';

/**
 * Creates an XML RSS feed containing all published blog posts with their metadata and preview image if available.
 */
export async function GET() {
  console.log('[RSS] Generating RSS feed...');
  try {
    const posts = await getAllPostsMeta();

    const feedOptions = {
      title: siteMetadata.title,
      description: siteMetadata.description,
      site_url: siteMetadata.siteUrl,
      feed_url: `${siteMetadata.siteUrl}/rss.xml`,
      image_url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner ?? siteMetadata.siteLogo ?? ''}`,
      pubDate: new Date(),
      copyright: `© ${new Date().getFullYear()} ${siteMetadata.author}`,
      language: siteMetadata.language,
    };

    const feed = new RSS(feedOptions);

    for (const post of posts) {

      if (post.draft) {
        console.info(`[RSS] Skipping draft post: ${post.slug}`);
        continue;
      }

      if (!post.title || !post.slug || !post.date || !post.description) {
        console.warn(`[RSS] Skipping post in RSS feed due to missing data: ${post.slug ?? 'Unknown Slug'}`);
        continue;
      }

      const postUrl = `${siteMetadata.siteUrl}/posts/${post.slug}`;
      let descriptionHtml = post.description;

      let imageUrlAbsolute: string | null = null;
      if (post.image) {
        imageUrlAbsolute = post.image.startsWith('http') ? post.image : `${siteMetadata.siteUrl}${post.image.startsWith('/') ? '' : '/'}${post.image}`;
        descriptionHtml = `
          <div style="display: flex;">
            <img 
              src="${imageUrlAbsolute}" 
              alt="${post.title}" 
              style="width: 120px; height: auto; object-fit: cover; border-radius: 4px; margin-right: 16px;" 
            />
            <div style="flex: 1;">${post.description}</div>
          </div>`;
      }

      feed.item({
        title: post.title,
        description: descriptionHtml,
        url: postUrl,
        guid: postUrl,
        date: new Date(post.date),
        author: siteMetadata.author,
        categories: post.tags ?? [],
      });
    }

    const xmlContent = feed.xml({ indent: true });

    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour // todo: update caching?
      },
    });
  } catch (error) {
    console.error('[RSS] Error generating RSS feed:', error);
    return new Response('Internal Server Error generating RSS feed.', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

