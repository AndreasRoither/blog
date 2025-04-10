import type { PostMeta } from "@/model/model";
import Link from "next/link";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard(params: PostCardProps) {
  const { post } = params;

  return (
    <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <Link href={`/posts/${post.slug}`} className="hover:underline">
        <h3 className="text-lg font-semibold tracking-tight mb-1">{post.title}</h3>
      </Link>
      <p className="text-sm text-muted-foreground mb-2">
        {post.formattedDate} &middot; {post.readTime}
        {post.series && ` (Series: ${post.series} - Part ${post.seriesPart})`}
      </p>
      <p className="text-sm leading-relaxed">{post.description}</p>
    </div>
  );
}
