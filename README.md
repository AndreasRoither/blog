<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="blog/public/donut.jpg" height="150">

  <h2 align="center">Blog</h2>

  <p align="center">
    Personal Blog about programming, tech, Japan, gaming, green tea, and trying new things.
    <br />
    <br />
    Built with Next.js, MDX, Tailwind CSS, and shadcn/ui.
    <br />
    <a href="https://blog.anro.dev"><strong>Check it out »</strong></a>
    <br />
    <br />
  </p>
</div>

## About The Project

This project is a personal blog to broaden my tech stack and learn new things.
It will contain posts about programming, tech, Japan, gaming, green tea, and trying new things.

Another core part will be tutorial series about setting up an creating web applications with various frameworks and libraries.

## Key Features

- **MDX Content:** Blog posts written in MDX (`.mdx`) allowing Markdown + React components.
- **Dynamic Routing:** Posts accessible via `/posts/entry/[slug]`.
- **Blog Index Page:** Overview page at `/posts` with:
  - Gallery view for posts with featured images.
  - Client-side tag filtering.
  - Posts sorted by date.
- **Syntax Highlighting:** Code blocks automatically highlighted using `rehype-pretty-code` and `shiki`.
- **Table of Contents:** Auto-generated TOC for individual posts (headings).
- **Theming:** Light/Dark/System theme support using `next-themes` and `shadcn/ui` CSS variables.
- **SEO:**
  - Dynamic generation of `robots.txt` and `sitemap.xml`.
  - Dynamic page titles and descriptions.
  - Canonical URLs, Open Graph, and Twitter Card meta tags for posts and pages.
- **RSS Feed:** Dynamically generated RSS feed available at `/rss.xml`.
- **Draft Mode:** Posts marked as `draft: true` in frontmatter are only visible during local development (`pnpm dev`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## File Structure Overview

```bash
.
├── app/
│   ├── blog-posts/           # Location for all .mdx blog post files
│   ├── posts/
│   │   ├── entry/
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Individual blog post page component
│   │   └── page.tsx          # Blog index/overview page component
│   ├── robots.txt/           
│   ├── rss.xml/              
│   ├── sitemap.xml/          
│   ├── layout.tsx            
│   ├── page.tsx              
│   └── globals.css           
├── components/  
├── lib/                      # Utility functions and helpers  
├── public/                   # Static assets (images, fonts, etc.)
```

## Content Management

- **Location:** Add new blog posts as `.mdx` files inside the `app/blog-posts/` directory.
- **Filename:** Use lowercase, hyphenated filenames for posts (e.g., `my-cool-new-post.mdx`). This filename (without `.mdx`) becomes the URL slug. Avoid spaces or special characters as they will not be URL-friendly.
- **Format:** Write content using Markdown and embed React components if needed (MDX).
- **Frontmatter:** Each post **must** include YAML frontmatter at the very top:
  ```yaml
  ---
  title: 'Awesome Post Title'
  date: 'YYYY-MM-DD' # e.g., 2025-04-04
  description: 'A short, compelling summary of your post for previews and SEO.'
  draft: false # Set to true to hide from production builds (visible in dev)
  tags: ['tag1', 'coding', 'another-tag'] # Optional
  image: '/donut.jpg'
  ---

  Your main post content starts here...
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Want to clone it?

### Prerequisites

* Node.js (v22 or later recommended)
* pnpm (You can install it via `npm install -g pnpm`)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/AndreasRoither/blog.git your-blog
    cd your-blog
    ```
2.  Install dependencies using pnpm:
    ```bash
    pnpm install
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Running the Project

Start the development server:
  ```bash
  pnpm dev
  ```
  - Open your browser and navigate to `http://localhost:3000` to view the blog.
Production build:
  ```bash
  pnpm build:prod
  ```
Start the production server:
  ```bash
  pnpm start
  ```

### Docker

Build the Docker image:
  ```bash
  docker build -t andreasroither/blog .
  ```

### Playwright

Runs the end-to-end tests.
  ```bash
  pnpm exec playwright test [--ui,--debug]
  ```
  
Starts the interactive UI mode.
  ```bash
  pnpm exec playwright test --ui
  ```

Auto generate tests with Codegen.
  ```bash
  pnpm exec playwright codegen
  ```

## Built With

* [Next.js](https://nextjs.org/) (v14+ with App Router)
* [React](https://react.dev/) (v18+)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/) (Component primitives via Radix UI)
* [Playwright](https://playwright.dev/) (End-to-end testing)
* [MDX](https://mdxjs.com/) (via `next-mdx-remote`)
* [next-themes](https://github.com/pacocoursey/next-themes) (Theming)
* [rehype-pretty-code](https://rehype-pretty-code.netlify.app/) & [shiki](https://shiki.style/) (Syntax Highlighting)
* [rehype-slug](https://github.com/rehypejs/rehype-slug) (Heading IDs for TOC)
* [gray-matter](https://github.com/jonschlinkert/gray-matter) (Frontmatter parsing)
* [date-fns](https://date-fns.org/) (Date formatting)
* [rss](https://www.npmjs.com/package/rss) (RSS feed generation)
* [reading-time](https://www.npmjs.com/package/reading-time) (Estimate post read time)
* [pnpm](https://pnpm.io/) (Package Manager)
* [biome](https://biome.dev/) (Code formatter and linter)


## Todo

- [ ] Seo for blog posts
- [ ] Individual robots.txt check from frontmatter for blog posts
- [ ] Tutorial series overview page / separate section?
- [ ] Do not regenerate sitemap if no new posts
- [ ] Do not regenerate rss feed if no new posts
- [ ] Do not regenerate robots.txt if no new posts
- [ ] Change series description to use `seriesDescription` from frontmatter
  - [ ] also custom image for series instead of image of first post


<p align="right">(<a href="#readme-top">back to top</a>)</p>


