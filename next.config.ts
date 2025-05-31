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
};

export default nextConfig;
