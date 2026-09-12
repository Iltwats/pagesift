import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium"],
  // Playwright resolves this manifest dynamically, so Next's file tracer does
  // not discover it automatically when packaging the serverless route. The
  // same applies to Sparticuz's compressed browser assets.
  outputFileTracingIncludes: {
    "/api/extract": [
      "./node_modules/playwright-core/browsers.json",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
};

export default nextConfig;
