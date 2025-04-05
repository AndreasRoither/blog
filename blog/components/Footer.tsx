import { siteMetadata } from "@/lib/siteMetadata";
import { Rss } from "lucide-react";
import { GithubLinkIcon } from "./link/GithubLinkIcon";
import { RssLinkIcon } from "./link/RssLinkIcon";
import { ThemeToggle } from "./theme/ThemeToggle";

export default function Footer() {
	return (
		<footer className="items-center  px-4 py-4 w-full bg-background border-t border-gray-200 dark:border-gray-700">
			<div className="flex justify-between items-center max-w-[80vw] mx-auto text-sm text-gray-500 dark:text-gray-400">
				<div className="flex items-center space-x-4">
					<GithubLinkIcon />

					<RssLinkIcon />

					<span>
						© {new Date().getFullYear()} {siteMetadata.author}
					</span>
				</div>
				<ThemeToggle />
			</div>
		</footer>
	);
}
