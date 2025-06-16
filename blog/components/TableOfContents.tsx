"use client";

import type { Heading } from "@/model/model";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Check for hash in URL
  useEffect(() => {
    if (headings.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # character
      if (hash && headings.some((heading) => heading.slug === hash)) {
        setActiveSlug(hash);
      }
    };

    handleHashChange(); // initial check
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [headings]);

  // scroll spy
  useEffect(() => {
    if (headings.length === 0) return;

    const observedElements = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveSlug(intersectingEntry.target.id);
        }
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      },
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.slug);

      if (element) {
        observer.observe(element);
        observedElements.set(heading.slug, element);
      }
    }

    if (window.scrollY === 0 && !window.location.hash && headings[0]) {
      setActiveSlug(headings[0].slug);
    }

    // Clean up using stored references
    return () => {
      for (const [slug, element] of observedElements) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [headings]);

  if (!headings || headings.length === 0) {
    return null;
  }

  const getIndentationClass = (depth: number) => {
    switch (depth) {
      case 1:
        return "ml-0";
      case 2:
        return "ml-0";
      case 3:
        return "ml-2";
      case 4:
        return "ml-4";
      case 5:
        return "ml-6";
      case 6:
        return "ml-8";
      default:
        return "ml-0";
    }
  };

  return (
    <nav className="sticky top-24 p-4 rounded-lg max-h-[calc(100vh-12rem)] overflow-y-auto">
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            className={getIndentationClass(heading.depth)}
          >
            <a
              href={`#${heading.slug}`}
              className={`block text-sm transition-colors duration-150 ${
                activeSlug === heading.slug
                  ? "text-blue-600 dark:text-primary font-semibold"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
