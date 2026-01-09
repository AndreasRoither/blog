import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import GithubProject from "@/components/GithubProject";
import LoadingImage from "@/components/LoadingImage";
import SeriesNavigation from "@/components/SeriesNavigation";
import SiteLayout from "@/components/SiteLayout";
import TableOfContents from "@/components/TableOfContents";
import { findSeriesBySlug, loadPostSlugs } from "@/lib/metadata-loader";
import { createSlug } from "@/lib/post-utils";
import { getPostBySlug } from "@/lib/posts";
import { siteMetadata } from "@/lib/siteMetadata";
import { formatImageUrl } from "@/lib/utils";
import type { Post, Series } from "@/model/model";
import type { Metadata } from "next";
import Link from "next/link";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const slugs = await loadPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PostPageParams {
  slug: string;
}

interface PostPageProps {
  params: Promise<PostPageParams>;
}

// todo: theme 'one-dark-pro', 'slack-ochin', etc.?
const prettyCodeOptions: Partial<RehypePrettyCodeOptions> = {
  theme: "github-dark",
  keepBackground: true,
  onVisitLine(node) {
    // prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = node.properties.className ?? [];
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
};

const components = {
  GithubProject,
};

/**
 * Generates metadata for a blog post page based on the post slug.
 *
 * This function fetches the post data using the provided slug and constructs
 * the appropriate metadata for the page, including OpenGraph data for social sharing.
 *
 * @param params - Object containing route parameters
 * @param params.slug - The unique identifier for the blog post
 * @returns A Promise that resolves to a Metadata object for the post
 *  - If the post is found, returns full metadata
 *  - If the post isn't found, returns minimal metadata
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params; // dynamic api is async
  const post: Post | null = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const postUrl = `${siteMetadata.siteUrl}/posts/${slug}`;
  const author = siteMetadata.author;
  const imageUrl = post.image
    ? formatImageUrl(post.image)
    : siteMetadata.socialBanner;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: siteMetadata.title,
      locale: siteMetadata.locale,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.lastModified ?? post.date).toISOString(),
      authors: [author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      section: "Technology",
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post: Post | null = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const {
    title,
    draft,
    formattedDate,
    formattedLastModifiedDate,
    readTime,
    tags,
    content,
    headings,
    image,
  } = post;

  // Use relative paths for local images, keep absolute URLs for external images
  const getImageSrc = (img: string | undefined): string => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return img.startsWith("/") ? img : `/${img}`;
  };
  const imageSrc = getImageSrc(image);

  let seriesData: Series | null = null;
  let postIndexInSeries = -1;

  if (post.series) {
    const seriesSlug = createSlug(post.series);
    seriesData = await findSeriesBySlug(seriesSlug);
    if (seriesData) {
      postIndexInSeries = seriesData.posts.findIndex((p) => p.slug === post.slug);
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.lastModified ?? post.date).toISOString(),
    author: {
      "@type": "Person",
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteMetadata.author,
    },
    url: `${siteMetadata.siteUrl}/posts/${slug}`,
    ...(image && { image: formatImageUrl(image) }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
  };

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <div className="mx-auto px-4 py-8 xl:flex xl:flex-row xl:gap-8 grow max-w-[1600px]">
          <div className="hidden xl:block xl:w-12 shrink-0">
            <Link
              href="/"
              className="sticky top-24 text-blue-500 hover:underline dark:text-blue-400 text-sm"
            >
              ← cd ..
            </Link>
          </div>

          <article className="grow max-md:max-w-[90vw] max-lg:max-w-[80vw] max-w-none w-full xl:min-w-0 xl:max-w-4xl 2xl:max-w-5xl">
            {" "}
            <Link
              href="/"
              className="xl:hidden text-blue-500 hover:underline mb-4 block dark:text-blue-400"
            >
              ← cd ..
            </Link>
            <header className="mb-8">
              <h1 className="text-xl lg:text-4xl xl:text-5xl font-bold">
                {draft && <span className="text-yellow-500 mr-2">[DRAFT]</span>}
                {title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm pt-4">
                {formattedDate} | {readTime}
              </p>

              {formattedLastModifiedDate && formattedLastModifiedDate !== formattedDate && (
                <p className="text-gray-500 dark:text-gray-400 text-sm pt-1">
                  Last update: {formattedLastModifiedDate}
                </p>
              )}

              {draft && (
                <p className="text-yellow-500 dark:text-yellow-400 text-sm pt-2">
                  This post is a draft and may not be complete.
                </p>
              )}

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            {image && (
              <div className="mb-8">
                <LoadingImage
                  src={imageSrc}
                  alt={title}
                  title={title}
                  className="w-full h-auto"
                />
              </div>
            )}
            <div className="prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
              <MDXRemote
                source={content}
                components={components}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
                  },
                }}
              />
            </div>
          </article>

          {/* Series navigation for medium screens (shows after article) */}
          {seriesData && postIndexInSeries !== -1 && (
            <div className="xl:hidden">
              <SeriesNavigation
                series={seriesData}
                currentPost={post}
                postIndexInSeries={postIndexInSeries}
              />
            </div>
          )}

          <aside className="hidden xl:block xl:w-64 2xl:w-80 shrink-0">
            {seriesData && postIndexInSeries !== -1 && (
              <SeriesNavigation
                series={seriesData}
                currentPost={post}
                postIndexInSeries={postIndexInSeries}
              />
            )}
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
