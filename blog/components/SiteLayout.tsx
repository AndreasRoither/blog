"use client";

import { siteMetadata } from "@/lib/siteMetadata";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import { ThemeToggle } from "./theme/ThemeToggle";

const Header = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // header scrollbar visibility check
  // show only if scrolled down more than a small threshold and show immediately when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 40);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="container flex items-center justify-between px-4 mx-auto h-14">
        <Link href="/" className="text-lg font-bold">
          {siteMetadata.headerTitle || siteMetadata.title}
        </Link>
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="hidden transition-colors text-muted-foreground hover:text-foreground sm:block">
            Home
          </Link>
          <Link
            href="/posts"
            className="transition-colors text-muted-foreground hover:text-foreground"
          >
            Posts
          </Link>
          <Link
            href="/series"
            className="transition-colors text-muted-foreground hover:text-foreground"
          >
            Series
          </Link>
          <ThemeToggle className="hidden md:block"/>
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
