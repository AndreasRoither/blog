import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { siteConfig } from "@/lib/siteConfig";
import { siteMetadata } from "@/lib/siteMetadata";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1600,
        height: 1260,
        alt: siteMetadata.title,
      },
    ],
    locale: siteMetadata.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // Manifest file
  // manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteMetadata.language} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteMetadata.title} - RSS Feed`}
          href="/rss.xml"
        />
        <script defer src="https://umami.anro.dev/script.js" data-website-id={siteConfig.umami} />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
