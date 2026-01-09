import fs from 'node:fs';
import path from 'node:path';
import type { PostMeta, Series } from '../model/model';
import { getAllPostsMetaFromFS } from './posts-fs';
import { createSlug } from './post-utils';

const _isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Cache for loaded metadata in production
let cachedPosts: PostMeta[] | null = null;
let cachedSeries: Series[] | null = null;

/**
 * Loads posts metadata from JSON file (production) or filesystem (development)
 */
export async function loadPostsMetadata(): Promise<PostMeta[]> {
  if (isDevelopment) {
    // In development, always read from filesystem for hot reloading
    return await getAllPostsMetaFromFS();
  }

  // In production, use cached data or load from JSON
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'api', 'posts-metadata.json');

    if (!fs.existsSync(jsonPath)) {
      console.warn('[METADATA] Posts metadata JSON not found, falling back to filesystem');
      return await getAllPostsMetaFromFS();
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    cachedPosts = JSON.parse(jsonData);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[METADATA] Loaded ${cachedPosts?.length || 0} posts from JSON`);
    }
    return cachedPosts || [];

  } catch (error) {
    console.error('[METADATA] Error loading posts from JSON, falling back to filesystem:', error);
    return await getAllPostsMetaFromFS();
  }
}

/**
 * Loads series metadata from JSON file (production) or filesystem (development)
 */
export async function loadSeriesMetadata(): Promise<Series[]> {
  if (isDevelopment) {
    // In development, always generate from filesystem for hot reloading
    return await getSeriesFromFS();
  }

  // In production, use cached data or load from JSON
  if (cachedSeries) {
    return cachedSeries;
  }

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'api', 'series-metadata.json');

    if (!fs.existsSync(jsonPath)) {
      console.warn('[METADATA] Series metadata JSON not found, falling back to filesystem');
      return await getSeriesFromFS();
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    cachedSeries = JSON.parse(jsonData);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[METADATA] Loaded ${cachedSeries?.length || 0} series from JSON`);
    }
    return cachedSeries || [];

  } catch (error) {
    console.error('[METADATA] Error loading series from JSON, falling back to filesystem:', error);
    return await getSeriesFromFS();
  }
}

/**
 * Builds series data from an array of posts.
 * Shared logic used by both series.ts and metadata-loader.ts
 */
export function buildSeriesFromPosts(posts: PostMeta[]): Series[] {
  const seriesMap: Map<string, Series> = new Map();

  for (const post of posts) {
    if (!post.series || (post.draft === true && process.env.NODE_ENV === 'production')) continue;

    const seriesTitle = post.series;
    const seriesSlug = createSlug(seriesTitle);

    if (!seriesMap.has(seriesSlug)) {
      seriesMap.set(seriesSlug, {
        title: seriesTitle,
        slug: seriesSlug,
        posts: [],
        lastModified: post.lastModified || post.date,
        description: post.seriesPart === 1 ? post.description : undefined,
        image: post.seriesPart === 1 ? post.image : undefined,
      });
    }

    const currentSeries = seriesMap.get(seriesSlug)!;
    currentSeries.posts.push(post);

    // Update lastModified date for the series if this post is newer
    const postDate = new Date(post.lastModified || post.date);
    const seriesDate = new Date(currentSeries.lastModified);
    if (postDate > seriesDate) {
      currentSeries.lastModified = post.lastModified || post.date;
    }

    // Update description/image if this is part 1 and we didn't have one yet
    if (post.seriesPart === 1) {
      if (!currentSeries.description) currentSeries.description = post.description;
      if (!currentSeries.image) currentSeries.image = post.image;
    }
  }

  // Sort posts within each series by seriesPart
  for (const series of seriesMap.values()) {
    series.posts.sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));
  }

  // Convert Map to Array and sort series themselves by last modified date (newest first)
  const allSeries = Array.from(seriesMap.values());
  allSeries.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

  return allSeries;
}

/**
 * Generate series from posts (filesystem implementation)
 */
async function getSeriesFromFS(): Promise<Series[]> {
  const posts = await getAllPostsMetaFromFS();
  return buildSeriesFromPosts(posts);
}

/**
 * Gets post slugs from metadata
 */
export async function loadPostSlugs(): Promise<string[]> {
  const posts = await loadPostsMetadata();
  return posts.map(post => post.slug);
}

/**
 * Finds a specific post by slug from metadata
 */
export async function findPostMetaBySlug(slug: string): Promise<PostMeta | null> {
  const posts = await loadPostsMetadata();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Finds a specific series by slug from metadata
 */
export async function findSeriesBySlug(slug: string): Promise<Series | null> {
  const series = await loadSeriesMetadata();
  return series.find(s => s.slug === slug) || null;
}
