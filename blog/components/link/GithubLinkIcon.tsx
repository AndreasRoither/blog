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
            className="p-1 transition-transform duration-150 rounded-full dark:bg-white dark:bg-opacity-10 hover:scale-110"
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
