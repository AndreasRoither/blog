import SeriesCard from "@/components/SeriesCard";
import SiteLayout from "@/components/SiteLayout";
import { getAllSeries } from "@/lib/series";
import { siteMetadata } from "@/lib/siteMetadata";
import Link from "next/link";
import { getAllPostsMeta } from "../lib/posts";
import type { PostMeta } from "../model/model";

const calculateTagCounts = (posts: PostMeta[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }

  return counts;
};

export default async function Home() {
  // Fetch posts directly here (server-side)
  // Sort tags by count desc
  const posts = await getAllPostsMeta();
  const tagCounts = calculateTagCounts(posts);
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]); // Sort by count (descending)
  const latestPosts = posts.slice(0, 5);
  const latestSeries = (await getAllSeries(posts)).slice(0, 3);

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 flex-grow w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {siteMetadata.headerTitle ?? siteMetadata.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{siteMetadata.description}</p>
        </header>

        {!posts ||
          (posts.length === 0 && (
            <div className="max-w-3xl mx-auto px-4 py-8">
              <p className="text-center dark:text-gray-400">No posts yet :)</p>
            </div>
          ))}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 pb-2">Latest Posts</h2>
          <ul>
            {latestPosts.map((post) => (
              <li key={post.slug} className="mb-5 ">
                <Link href={`/posts/${post.slug}`} className="group block">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {post.draft && <span className="text-yellow-500 mr-2">[DRAFT]</span>}
                      <span className="text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {post.formattedDate}
                    </span>
                  </div>
                  <hr className="border-t border-dashed border-gray-200 dark:border-gray-700 mt-3 group-hover:border-gray-300 dark:group-hover:border-gray-600" />
                </Link>
              </li>
            ))}
          </ul>
          {latestPosts.length > 5 && (
            <div className="mt-4 text-right">
              <Link href="/posts" className="text-sm text-blue-600 hover:underline">
                more &rarr;
              </Link>
            </div>
          )}
        </section>

        {latestSeries?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Latest Tutorial Series</h2>
            <div className="overflow-y-auto max-h-[600px] pr-2">
              {latestSeries.length > 0 ? (
                latestSeries.map((series) => <SeriesCard key={series.slug} series={series} />)
              ) : (
                <p className="text-muted-foreground">No tutorial series available yet.</p>
              )}
            </div>
            {latestSeries.length > 0 && (
              <div className="mt-4 text-right">
                <Link href="/series" className="text-sm text-blue-600 hover:underline">
                  View all series &rarr;
                </Link>
              </div>
            )}
          </section>
        )}

        {posts?.length > 0 && (
          <section className="mt-12">
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium cursor-default"
                title={`${posts.length} posts total`}
              >
                Total posts: {posts.length}
              </span>
              <div className="flex flex-wrap gap-2">
                {sortedTags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm font-medium cursor-default"
                    title={`${count} posts tagged with '${tag}'`}
                  >
                    {tag} {count}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
