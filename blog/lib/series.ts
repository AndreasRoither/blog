import type { PostMeta, Series } from "@/model/model";
import { buildSeriesFromPosts, loadSeriesMetadata } from "./metadata-loader";

export async function getAllSeries(posts?: PostMeta[]): Promise<Series[]> {
  // Use cached metadata if no posts provided
  if (!posts) {
    return await loadSeriesMetadata();
  }

  // Build series from provided posts
  return buildSeriesFromPosts(posts);
}
