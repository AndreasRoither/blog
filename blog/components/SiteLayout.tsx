import { siteMetadata } from "@/lib/siteMetadata";
import Link from "next/link";
import Footer from "./Footer";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          {siteMetadata.headerTitle || siteMetadata.title}
        </Link>
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link
            href="/posts"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Posts
          </Link>
          <Link
            href="/series"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Series
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
