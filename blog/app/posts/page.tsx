import SiteLayout from "@/components/SiteLayout";
import Link from "next/link";
import { getAllPostsMeta } from "../../lib/posts";

export default async function PostsIndexPage() {
  const posts = await getAllPostsMeta();

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 flex-grow w-full">
        {!posts ||
          (posts.length === 0 && (
            <div className="max-w-3xl mx-auto px-4 py-8">
              <p className="text-center dark:text-gray-400">No posts yet :)</p>
            </div>
          ))}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 pb-2">Posts</h2>

          {/* <div className="relative mb-4">
            <Input type="text" placeholder="Search" className="pl-10" />
            <Search className="h-5 w-5 absolute left-3 top-2 text-gray-400" />
          </div> */}

          <ul>
            {posts.map((post) => (
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
        </section>
      </div>
    </SiteLayout>
  );
}
