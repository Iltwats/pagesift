import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./styles/globals.css";
import { SITE_URL } from "./config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PageSift",
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "An AI-powered tool that extracts selected fields from public webpages and returns structured JSON.",
    isAccessibleForFree: true,
    featureList: [
      "Extract user-defined fields from webpages",
      "Return structured JSON",
      "Self-hosted deployment support",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
