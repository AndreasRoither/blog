import Footer from "@/components/Footer";
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

  return (
    <div className="min-h-screen flex flex-col">
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
          <ul>
            {posts.map((post) => (
              <li key={post.slug} className="mb-5 ">
                <Link href={`/posts/${post.slug}`} className="group block">
                  <div className="flex justify-between items-center">
                    {post.draft && <span className="text-yellow-500 mr-2">[DRAFT]</span>}
                    <span className="text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {post.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {post.formattedDate}
                    </span>
                  </div>
                  <hr className="border-t border-dashed border-gray-200 dark:border-gray-700 mt-3 group-hover:border-gray-300 dark:group-hover:border-gray-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {posts?.length > 0 && (
          <section>
            <div className="flex flex-wrap gap-3">
              <span
                className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium cursor-default"
                title={`${posts.length} posts total`}
              >
                Total posts: {posts.length}
              </span>
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
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
