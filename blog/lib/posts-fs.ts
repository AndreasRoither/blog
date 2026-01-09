import fs from 'node:fs';
import path from 'node:path';
import { format } from 'date-fns';
import matter from 'gray-matter';
import type { IReadTimeResults } from 'reading-time';
import readingTime from 'reading-time';
import type { Post, PostFrontmatter, PostMeta } from '../model/model';
import { extractHeadings } from './post-utils';

// root dir of posts
const postsDirectory = path.join(process.cwd(), 'app', 'blog-posts');

/**
 * Gets the slugs (filenames without extension) of all MDX files
 */
export function getAllPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`[BLOG] Posts directory not found at: ${postsDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    if (fileNames.length === 0) {
      console.info(`[BLOG] No files found in posts directory: ${postsDirectory}`);
      return [];
    }

    const mdxFiles = fileNames.filter((fileName) => {
      // check if the file is an MDX file
      if (!/\.mdx$/.test(fileName)) return false;

      // read the file to check if it's a draft
      const fullPath = path.join(postsDirectory, fileName);
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents) as { data: Partial<PostFrontmatter> };

        return data.draft !== true || process.env.NODE_ENV !== 'production';
      } catch (error) {
        console.error(`[BLOG] Error reading file ${fileName}:`, error);
        return false;
      }
    }).map((fileName) => fileName.replace(/\.mdx$/, '')); // remove the .mdx extension

    if (mdxFiles.length === 0) {
      console.info(`[BLOG] No MDX files found in posts directory: ${postsDirectory}`);
    } else {
      console.debug(`[BLOG] Found ${mdxFiles.length} MDX files in posts directory`);
    }

    return mdxFiles;
  } catch (error) {
    console.error(`[BLOG] Error reading posts directory (${postsDirectory}):`, error);
    return [];
  }
}

/**
 * Gets the parsed data (frontmatter and content) for a single post from filesystem.
 * @param {string} slug - The slug of the post.
 */
export async function getPostBySlugFromFS(slug: string): Promise<Post | null> {
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

    const stats: IReadTimeResults = readingTime(content);
    const originalDate = data.date ? new Date(data.date) : new Date();
    const headings = extractHeadings(content);

    return {
      slug,
      title: data.title ?? 'Untitled Post',
      date: data.date ?? originalDate.toISOString(),
      lastModified: data.lastModified ? new Date(data.lastModified).toISOString() : undefined,
      description: data.description ?? 'No description available.',
      tags: data.tags ?? [],
      draft: data.draft ?? false,
      image: data.image,
      series: data.series,
      seriesPart: data.seriesPart,
      seriesTotal: data.seriesTotal,
      formattedDate: format(originalDate, 'PPP'),
      formattedLastModifiedDate: data.lastModified ? format(new Date(data.lastModified), 'PPP') : undefined,
      readTime: stats.text,
      content,
      headings
    };
  } catch (error) {
    console.error(`[BLOG] Error reading or parsing post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Original filesystem-based metadata generation
 * Filters out posts marked as draft
 */
export async function getAllPostsMetaFromFS(): Promise<PostMeta[]> {
  const slugs = getAllPostSlugs();
  const postsPromises = slugs.map(async (slug): Promise<PostMeta | null> => {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    try {
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents) as { data: Partial<PostFrontmatter>, content: string };

      if (data.draft === true && process.env.NODE_ENV === 'production') {
        return null;
      }

      const stats: IReadTimeResults = readingTime(content);
      const originalDate = data.date ? new Date(data.date) : new Date();
      const formattedDate = data.date ? format(originalDate, 'PPP') : '';

      const meta: PostMeta = {
        slug,
        title: data.title ?? 'Untitled Post',
        date: data.date ?? originalDate.toISOString(),
        lastModified: data.lastModified ? new Date(data.lastModified).toISOString() : undefined,
        description: data.description ?? 'No description available.',
        tags: data.tags ?? [],
        draft: data.draft ?? false,
        formattedDate,
        formattedLastModifiedDate: data.lastModified ? format(new Date(data.lastModified), 'PPP') : undefined,
        readTime: stats.text,
        image: data.image,
        series: data.series,
        seriesPart: data.seriesPart,
        seriesTotal: data.seriesTotal,
      };
      return meta;

    } catch (error) {
      console.error(`[BLOG] Error processing metadata for slug ${slug}:`, error);
      return null;
    }
  });

  const results = await Promise.allSettled(postsPromises);
  const posts = results
    .filter((result): result is PromiseFulfilledResult<PostMeta | null> => result.status === 'fulfilled')
    .map(result => result.value)
    .filter((post): post is PostMeta => post !== null);

  // sort by date descending (newest first)
  return posts.sort((post1, post2) => {
    return new Date(post2.date).getTime() - new Date(post1.date).getTime()
  });
}
