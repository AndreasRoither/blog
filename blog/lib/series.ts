import type { PostMeta, Series } from "@/model/model";
import { loadSeriesMetadata } from "./metadata-loader";
import { createSlug } from "./post-utils";

export async function getAllSeries(posts?: PostMeta[]): Promise<Series[]> {
  // metadata if no posts provided
  if (!posts) {
    return await loadSeriesMetadata();
  }
  
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

    const currentSeries = seriesMap.get(seriesSlug) ?? {
      title: seriesTitle,
      slug: seriesSlug,
      posts: [],
      lastModified: post.lastModified || post.date,
    };
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
