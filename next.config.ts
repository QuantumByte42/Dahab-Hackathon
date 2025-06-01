import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Server external packages
  serverExternalPackages: ['pocketbase'],
  
  // Environment variables configuration
  env: {
    NEXT_POCKETBASE: process.env.NEXT_POCKETBASE || 'https://api.dahab.qb4.tech/',
  },
  
  // Image optimization configuration for production
  images: {
    unoptimized: true,
  },
  
  // Webpack configuration for PDF libraries
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        stream: false,
        util: false,
      }
    }
    
    // Optimize for dynamic imports of PDF libraries
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          pdf: {
            test: /[\\/]node_modules[\\/](jspdf|html2canvas)[\\/]/,
            name: 'pdf-libraries',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    }
    
    return config
  },
};

export default nextConfig;
