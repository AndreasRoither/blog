import { siteMetadata } from "@/lib/siteMetadata";
import { Mail } from "lucide-react";

export function MailLinkIcon() {
  return (
    <>
      {siteMetadata.github && (
        <a href={`mailto:${siteMetadata.email}`} aria-label="Email" className="hover:text-primary">
          <Mail width={32} className="hover:scale-110 transition-transform duration-150" />
        </a>
      )}
    </>
  );
}
