import { getAllSeries, getSeriesBySlug } from "@/lib/series";
import { siteMetadata } from "@/lib/siteMetadata";
import type { PostMeta } from "@/model/model";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SeriesPageParams {
  slug: string;
}

interface SeriesPageProps {
  params: Promise<SeriesPageParams>;
}

export async function generateMetadata({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return {
      title: "Series Not Found",
    };
  }

  return {
    title: `Series: ${series.title} | ${siteMetadata.title}`,
    description:
      series.description ||
      `Tutorial series about ${series.title}. Contains ${series.posts.length} parts.`,
    // openGraph: {
    //   title: series.title,
    //   description: series.description,
    //   url: `${siteMetadata.siteUrl}/series/${series.slug}`,
    //   images: series.image ? [{ url: `${siteMetadata.siteUrl}${series.image}` }] : [],
    // },
  };
}

export async function generateStaticParams() {
  const seriesList = await getAllSeries();
  return seriesList.map((series) => ({
    slug: series.slug,
  }));
}

const SeriesPostCard = ({ post, seriesSlug }: { post: PostMeta; seriesSlug: string }) => (
  <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4 transition-shadow hover:shadow-md">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
        {post.seriesPart ?? "?"}
      </div>
      <div className="flex-grow">
        <Link href={`/posts/${post.slug}`} className="hover:underline">
          <h3 className="text-lg font-semibold tracking-tight mb-1">{post.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">
          {post.formattedDate} &middot; {post.readTime}
        </p>
        <p className="text-sm leading-relaxed">{post.description}</p>
      </div>
    </div>
  </div>
);

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const imageUrlAbsolute = series.image?.startsWith("http")
    ? series.image
    : `${siteMetadata.siteUrl}${series.image?.startsWith("/") ? "" : "/"}${series.image}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{series.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">
          A {series.posts.length}-part tutorial series.
        </p>{" "}
        {series.description && <p className="max-w-2xl mx-auto text-base">{series.description}</p>}
        {series.image && (
          <div className="mt-6 relative h-48 w-full max-w-xl mx-auto rounded-lg overflow-hidden">
            <Image
              src={imageUrlAbsolute}
              alt={`Image for ${series.title} series`}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Posts in this Series</h2>
        {series.posts.length > 0 ? (
          series.posts.map((post) => (
            <SeriesPostCard key={post.slug} post={post} seriesSlug={series.slug} />
          ))
        ) : (
          <p className="text-muted-foreground">No posts found in this series yet.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/series" className="text-sm text-blue-600 hover:underline">
          &larr; Back to all series
        </Link>
      </div>
    </div>
  );
}
