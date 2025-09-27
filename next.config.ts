import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Configuração para Turbopack (desenvolvimento)
  turbopack: {
    resolveAlias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  // Configuração para Webpack (produção/Vercel)
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };

    return config;
  },
};

export default nextConfig;
