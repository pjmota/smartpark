import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack: (config, { isServer }) => {
    // Configuração mais robusta de aliases para ambos client e server
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/context': path.resolve(__dirname, 'src/context'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
    };

    // Garante que os módulos sejam resolvidos corretamente
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];

    return config;
  },
};

export default nextConfig;
