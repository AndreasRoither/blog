import { siteMetadata } from "@/lib/siteMetadata";
import { Mail } from "lucide-react";

export function MailLinkIcon() {
  return (
    <>
      {siteMetadata.github && (
        <a href={`mailto:${siteMetadata.email}`} aria-label="Email" className="hover:text-primary">
          <Mail
            height={32}
            width={32}
            className="w-6 h-6 transition-transform duration-150 sm:h-7 sm:w-7 hover:scale-110"
          />
        </a>
      )}
    </>
  );
}
