import type { Metadata } from "next";
import { SITE_URL } from "./site";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PageSift — Extract Structured Data from Any Webpage",
  description:
    "Turn any public webpage into clean, structured JSON. Paste a URL, choose the fields you need, and extract web data with AI.",
  applicationName: "PageSift",
  keywords: [
    "web data extraction",
    "webpage to JSON",
    "AI web scraper",
    "structured data extraction",
    "website data extractor",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "PageSift",
    title: "PageSift — Extract Structured Data from Any Webpage",
    description:
      "Paste a URL, choose the fields you need, and turn webpages into structured JSON with AI.",
    images: [
      {
        url: "/pagesift.png",
        width: 1440,
        height: 1000,
        alt: "PageSift webpage data extraction interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PageSift — AI Webpage Data Extractor",
    description: "Turn webpages into structured JSON by selecting the fields you need.",
    images: ["/pagesift.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
