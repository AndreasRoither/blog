import { siteMetadata } from "@/lib/siteMetadata";
import Image from "next/image";

export function GithubLinkIcon() {
	return (
		<>
			{siteMetadata.github && (
				<a
					href={siteMetadata.siteRepo}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub Profile"
					className="hover:text-gray-400"
				>
					<Image
						className="dark:bg-white dark:bg-opacity-10 rounded-full p-1 hover:scale-110 transition-transform duration-150"
						alt="GitHub"
						src="/svg/github.svg"
						width={32}
						height={32}
					/>
				</a>
			)}
		</>
	);
}
