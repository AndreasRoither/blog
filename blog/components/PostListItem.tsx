import type { PostMeta } from "@/model/model";
import Link from "next/link";

interface PostListItemProps {
  post: PostMeta;
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <li className="mb-5">
      <Link href={`/posts/${post.slug}`} className="group block">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {post.draft && <span className="text-yellow-500 mr-2">[DRAFT]</span>}
            <span className="text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {post.title}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0 ml-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {post.formattedDate}
          </span>
        </div>
        <hr className="border-t border-dashed border-gray-200 dark:border-gray-700 mt-3 group-hover:border-gray-300 dark:group-hover:border-gray-600" />
      </Link>
    </li>
  );
}
