import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack: (config, { isServer }) => {
    // Solução específica para Vercel - usar path.join ao invés de path.resolve
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };

    return config;
  },
};

export default nextConfig;
