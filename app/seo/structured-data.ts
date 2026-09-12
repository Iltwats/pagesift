import { SITE_URL } from "./site";

export const structuredData = {
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
