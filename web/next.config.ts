import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  devIndicators: false,
  distDir: "dist",
  turbopack: { root: process.env.QUANTAVAULT_PAGES_BUILD === "1" ? path.resolve(process.cwd(), "..") : process.cwd() },
  ...(process.env.QUANTAVAULT_PAGES_BUILD === "1" ? {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
