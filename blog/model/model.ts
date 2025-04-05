

// hading for markdown post table of contents
export interface Heading {
  text: string;
  depth: number; // e.g., 1 for <h1>, 2 for <h2>
  slug: string; // URL-friendly slug/id
}

// Post metadata
export interface PostFrontmatter {
  title: string;
  date: string; // Keep original date string for sorting, format later
  lastModified?: string;
  description: string;
  tags?: string[];
  draft?: boolean;
  image?: string;
  // todo: more fields, maybe image?
}

// meta data for each post
export interface PostMeta extends PostFrontmatter {
  slug: string;
  formattedDate: string; // Formatted date for display
  formattedLastModifiedDate?: string; // Formatted update date for display
  readTime: string; // (e.g., "5 min read")
}

// Full post
export interface Post extends PostMeta {
  content: string;
  headings: Heading[];
}


