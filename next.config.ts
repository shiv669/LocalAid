import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Optimized for Appwrite static hosting
  distDir: 'out',
  basePath: '',
  assetPrefix: '',
  trailingSlash: false,
};

export default nextConfig;
