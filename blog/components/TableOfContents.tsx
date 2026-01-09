"use client";

import type { Heading } from "@/model/model";
import { useEffect, useState, useRef } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface TableOfContentsProps {
  headings: Heading[];
}

function TableOfContentsInner({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const isHashNavigating = useRef(false);

  // Check for hash in URL
  useEffect(() => {
    if (headings.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # character
      if (hash && headings.some((heading) => heading.slug === hash)) {
        isHashNavigating.current = true;
        setActiveSlug(hash);
        // Reset flag after scroll completes
        setTimeout(() => {
          isHashNavigating.current = false;
        }, 100);
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
        // Skip if hash navigation is in progress
        if (isHashNavigating.current) return;

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
      for (const [_slug, element] of observedElements) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [headings]);

  if (!headings || headings.length === 0) {
    return null;
  }

  const getIndentationStyle = (depth: number): React.CSSProperties => {
    // Using inline styles because Tailwind purges dynamic classes
    // h2 = main sections (no indent), h3+ = progressively indented
    const margins: Record<number, string> = {
      1: "0",
      2: "0",
      3: "1rem",
      4: "2rem",
      5: "3rem",
      6: "4rem",
    };
    return { marginLeft: margins[depth] || "0" };
  };

  return (
    <nav aria-label="Table of contents" className="sticky top-24 p-4 rounded-lg max-h-[calc(100vh-12rem)] overflow-y-auto">
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            style={getIndentationStyle(heading.depth)}
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

export default function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <ErrorBoundary
      fallback={
        <nav aria-label="Table of contents" className="sticky top-24 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Table of contents unavailable
          </p>
        </nav>
      }
    >
      <TableOfContentsInner headings={headings} />
    </ErrorBoundary>
  );
}
