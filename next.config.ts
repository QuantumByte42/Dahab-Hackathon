import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Enable server-side rendering optimizations
    serverComponentsExternalPackages: ['pocketbase'],
  },
  
  // Environment variables configuration
  env: {
    NEXT_POCKETBASE: process.env.NEXT_POCKETBASE || 'http://localhost:8090',
  },
  
  // Image optimization configuration for production
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
