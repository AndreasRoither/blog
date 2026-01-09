import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { siteMetadata } from "./siteMetadata"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatImageUrl(image: string): string {
  if (image.startsWith("http")) return image;
  return `${siteMetadata.siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}
