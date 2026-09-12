import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PageSift — Webpage Data Extractor",
    short_name: "PageSift",
    description: "Extract structured data from any public webpage using AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfdfb",
    theme_color: "#20704a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
