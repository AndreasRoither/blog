import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import type { Post, PostFrontmatter } from '../model/model';
import { findPostMetaBySlug } from './metadata-loader';
import { extractHeadings } from './post-utils';
import { getPostBySlugFromFS } from './posts-fs';

// root dir of posts
const postsDirectory = path.join(process.cwd(), 'app', 'blog-posts');

/**
 * Gets the parsed data (frontmatter and content) for a single post.
 * Uses metadata for quick lookup; but still uses content from fs
 * @param {string} slug - The slug of the post.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // try gen. post meta first
  const postMeta = await findPostMetaBySlug(slug);
  if (!postMeta && process.env.NODE_ENV === 'production') {
    console.warn(`[BLOG] Post metadata not found for slug: ${slug}`);
    return null;
  }

  // Always read content from filesystem (needed for MDX rendering)
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`[BLOG] Post file not found for slug: ${slug}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents) as { data: Partial<PostFrontmatter>, content: string };

    if (data.draft === true && process.env.NODE_ENV === 'production') {
      console.info(`[BLOG] Skipping draft post in production: ${slug}`);
      return null;
    }

    if (postMeta) {
      const headings = extractHeadings(content);
      return {
        ...postMeta,
        content,
        headings
      };
    }

    // Fallback: use filesystem implementation
    return await getPostBySlugFromFS(slug);
  } catch (error) {
    console.error(`[BLOG] Error reading or parsing post with slug ${slug}:`, error);
    return null;
  }
}
