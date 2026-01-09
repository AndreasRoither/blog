import PostListItem from "@/components/PostListItem";
import SiteLayout from "@/components/SiteLayout";
import { loadPostsMetadata } from "@/lib/metadata-loader";
import { siteMetadata } from "@/lib/siteMetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `All Posts | ${siteMetadata.title}`,
  description: `Browse all blog posts on ${siteMetadata.title}. Covering software development, technology, and the occasional matcha.`,
  openGraph: {
    title: `All Posts | ${siteMetadata.title}`,
    description: `Browse all blog posts on ${siteMetadata.title}.`,
    url: `${siteMetadata.siteUrl}/posts`,
    type: 'website',
  },
};

export default async function PostsIndexPage() {
  const posts = await loadPostsMetadata();

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16 grow w-full">
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
              <PostListItem key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      </div>
    </SiteLayout>
  );
}
