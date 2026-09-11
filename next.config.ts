import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium"],
};

export default nextConfig;
