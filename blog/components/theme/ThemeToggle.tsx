"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "../ui/button";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  // Need to track mounted state to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing or a placeholder until mounted on the client
  if (!mounted) {
    return (
      <div
        className={`flex items-center space-x-1 border border-gray-300 dark:border-gray-700 rounded-lg p-0.5 ${className}`}
      >
        <Button
          size={"icon"}
          variant="ghost"
          type="button"
          aria-label="Switch to Light Mode"
          className="p-1 transition-colors duration-150 hover:cursor-pointer opacity-50"
        >
          <Sun size={8} />
        </Button>
        <Button
          size={"icon"}
          variant="ghost"
          type="button"
          aria-label="Switch to Dark Mode"
          className="p-1 transition-colors duration-150 hover:cursor-pointer opacity-50"
        >
          <Moon size={8} />
        </Button>
        <Button
          size={"icon"}
          variant="ghost"
          type="button"
          aria-label="Switch to System Mode"
          className="p-1 transition-colors duration-150 hover:cursor-pointer opacity-50"
        >
          <Monitor size={8} />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-1 border border-gray-600 rounded-lg p-0.5 w-fit ${className}`}
    >
      <Button
        size={"icon"}
        variant={theme === "light" ? "default" : "ghost"}
        type="button"
        aria-label="Switch to Light Mode"
        onClick={() => setTheme("light")}
        className="p-1 transition-colors duration-150 hover:cursor-pointer"
      >
        <Sun size={8} />
      </Button>
      <Button
        size={"icon"}
        variant={theme === "dark" ? "default" : "ghost"}
        type="button"
        aria-label="Switch to Dark Mode"
        onClick={() => setTheme("dark")}
        className="p-1 transition-colors duration-150 hover:cursor-pointer"
      >
        <Moon size={8} />
      </Button>
      <Button
        size={"icon"}
        variant={theme === "system" ? "default" : "ghost"}
        type="button"
        aria-label="Switch to System Mode"
        onClick={() => setTheme("system")}
        className="p-1 transition-colors duration-150 hover:cursor-pointer"
      >
        <Monitor size={8} />
      </Button>
    </div>
  );
}
