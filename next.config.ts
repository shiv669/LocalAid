import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure proper routing for static export
  distDir: 'out',
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  skipTrailingSlashRedirect: false,
};

export default nextConfig;
