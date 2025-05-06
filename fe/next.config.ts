import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  output: 'standalone',
  // Add environment-specific configuration
  env: {
    // These values will be overridden by .env files or runtime environment variables
  },
};

console.log(`Building Next.js with NODE_ENV: ${process.env.NODE_ENV}`);

export default nextConfig;
