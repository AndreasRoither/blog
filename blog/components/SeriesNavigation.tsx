import Link from "next/link";
import type { Series, Post } from "@/model/model";

interface SeriesNavigationProps {
  series: Series;
  currentPost: Post;
  postIndexInSeries: number;
}

export default function SeriesNavigation({
  series,
  currentPost,
  postIndexInSeries
}: SeriesNavigationProps) {
  const hasPrevious = postIndexInSeries > 0;
  const hasNext = postIndexInSeries < series.posts.length - 1;
  const previousPost = hasPrevious ? series.posts[postIndexInSeries - 1] : null;
  const nextPost = hasNext ? series.posts[postIndexInSeries + 1] : null;

  return (
    <div className="my-6 p-4 border rounded bg-muted not-prose">
      <h3 className="text-base font-semibold mb-2">
        <p>Part {currentPost.seriesPart} of the series: </p>
        <Link
          href={`/series/${series.slug}`}
          className="text-blue-600 hover:underline"
        >
          {series.title}
        </Link>
      </h3>
      <div className="flex justify-between text-sm">
        {previousPost ? (
          <Link
            href={`/posts/${previousPost.slug}`}
            className="text-blue-600 hover:underline"
          >
            <span>&larr; Previous</span>
          </Link>
        ) : (
          <span className="opacity-50">No Previous entry</span>
        )}
        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="text-blue-600 hover:underline"
          >
            <span>Next &rarr;</span>
          </Link>
        ) : (
          <span className="opacity-50">Next is not out yet!</span>
        )}
      </div>
    </div>
  );
}
