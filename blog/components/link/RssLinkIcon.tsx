import { siteMetadata } from "@/lib/siteMetadata";
import { Rss } from "lucide-react";

export function RssLinkIcon() {
  return (
    <>
      {siteMetadata.github && (
        <a
          href={siteMetadata.rss}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="hover:text-primary"
        >
          <Rss className="w-6 h-6 transition-transform duration-150 sm:h-7 sm:w-7 hover:scale-110" />
        </a>
      )}
    </>
  );
}
