import SiteLayout from "@/components/SiteLayout";
import { getAllSeries } from "@/lib/series";
import { siteMetadata } from "@/lib/siteMetadata";
import type { Series } from "@/model/model";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: `Tutorial Series | ${siteMetadata.title}`,
  description: `Browse all tutorial series available on ${siteMetadata.title}.`,
  openGraph: {
    title: `Tutorial Series | ${siteMetadata.title}`,
    description: `Browse all tutorial series available on ${siteMetadata.title}.`,
    url: `${siteMetadata.siteUrl}/series`,
    type: 'website',
  },
};

const SeriesOverviewCard = ({ series }: { series: Series }) => (
  <div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-shadow hover:shadow-lg" data-testid="series-overview-card">
    {series.image && (
      <div className="relative h-40 w-full">
        {series.image && (
          <Image
            src={series.image.startsWith("/") ? series.image : `/${series.image}`}
            alt={`Cover image for ${series.title} series`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg shadow-lg"
          />
        )}
      </div>
    )}
    <div className="p-4 md:p-6">
      <Link href={`/series/${series.slug}`} className="hover:underline" data-testid="series-overview-title-link">
        <h2 className="text-xl font-semibold tracking-tight mb-1">{series.title}</h2>
      </Link>
      <p className="text-sm text-muted-foreground mb-3">
        {series.posts.length} Part{series.posts.length === 1 ? "" : "s"} &middot; Last updated:{" "}
        {format(new Date(series.lastModified), "PPP")}
      </p>
      {series.description && <p className="text-sm leading-relaxed mb-4">{series.description}</p>}
      <div className="text-xs space-y-1">
        <span className="font-medium">Includes:</span>
        {series.posts.slice(0, 3).map((p) => (
          <div key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="text-blue-600 hover:underline" data-testid="series-overview-post-link">
              Part {p.seriesPart}: {p.title}
            </Link>
          </div>
        ))}
        {series.posts.length > 3 && (
          <div className="italic text-muted-foreground">...and {series.posts.length - 3} more</div>
        )}
      </div>
      <div className="mt-4">
        <Link
          href={`/series/${series.slug}`}
          className="text-sm text-primary hover:underline font-medium"
          data-testid="series-overview-view-link"
        >
          View Full Series &rarr;
        </Link>
      </div>
    </div>
  </div>
);

export default async function AllSeriesPage() {
  const allSeries = await getAllSeries();

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="series-page-title">Tutorial Series</h1>
          <p className="text-lg text-muted-foreground">
            Browse through the available tutorial series.
          </p>
        </div>

        {allSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="series-grid">
            {allSeries.map((series) => (
              <SeriesOverviewCard key={series.slug} series={series} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="series-empty">
            <p className="text-muted-foreground">No tutorial series have been published yet.</p>
            <p className="mt-4">
              <Link href="/" className="text-blue-600 hover:underline" data-testid="series-back-home-link">
                &larr; Back to Home
              </Link>
            </p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
