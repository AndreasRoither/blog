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
					<Rss
						width={32}
						className="hover:scale-110 transition-transform duration-150"
					/>
				</a>
			)}
		</>
	);
}
