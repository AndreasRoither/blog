import type { Series } from "@/model/model";
import { format } from "date-fns";
import Link from "next/link";

interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard(params: SeriesCardProps) {
  const { series } = params;

  return (
    <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <Link href={`/series/${series.slug}`} className="hover:underline">
        <h3 className="text-lg font-semibold tracking-tight mb-1">{series.title}</h3>
      </Link>
      <p className="text-sm text-muted-foreground mb-2">
        {series.posts.length} Part{series.posts.length === 1 ? "" : "s"} &middot; Last updated:{" "}
        {format(new Date(series.lastModified), "PPP")}
      </p>
      <div className="text-xs">
        {series.posts.slice(0, 3).map((p) => (
          <div key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="text-blue-600 hover:underline">
              Part {p.seriesPart}: {p.title}
            </Link>
          </div>
        ))}
        {series.posts.length > 3 && <div className="italic">...and more</div>}
      </div>
    </div>
  );
}
