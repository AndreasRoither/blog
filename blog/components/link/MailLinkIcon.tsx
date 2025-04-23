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
            className="w-6 h-6 transition-transform duration-150 sm:h-8 sm:w-8 hover:scale-110"
          />
        </a>
      )}
    </>
  );
}
