import { siteMetadata } from "@/lib/siteMetadata";
import { GithubLinkIcon } from "./link/GithubLinkIcon";
import { MailLinkIcon } from "./link/MailLinkIcon";
import { RssLinkIcon } from "./link/RssLinkIcon";
import { ThemeToggle } from "./theme/ThemeToggle";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="items-center w-full px-4 py-4 border-t border-gray-200 bg-background dark:border-gray-700">
      <div className="flex justify-between items-center max-w-[80vw] mx-auto text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <GithubLinkIcon />

          <RssLinkIcon />

          <MailLinkIcon />

          <span className="max-sm:text-xs" data-testid="footer-copyright">
            © {CURRENT_YEAR} {siteMetadata.author}
          </span>
        </div>

        <ThemeToggle />
      </div>
    </footer>
  );
}
