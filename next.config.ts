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
    NEXT_POCKETBASE: process.env.NEXT_POCKETBASE || 'https://api.dahab.qb4.tech/',
  },
  
  // Image optimization configuration for production
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
