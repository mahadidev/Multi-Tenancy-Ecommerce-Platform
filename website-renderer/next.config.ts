import type { NextConfig } from "next";

const disableCache = process.env.DISABLE_CACHE === 'true';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Experimental features including cache control
  experimental: {
    staleTimes: {
      dynamic: disableCache ? 0 : 180,
      static: disableCache ? 0 : 180,
    },
  },
  // Disable static generation and force dynamic rendering
  ...(disableCache && {
    generateBuildId: async () => {
      // Generate unique build ID to prevent caching across builds
      return `build-${Date.now()}`;
    },
  }),
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8001',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  // Aggressive cache headers when cache is disabled
  headers: async () => {
    const headers = [];
    
    if (disableCache) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'X-Cache-Status',
            value: 'DISABLED',
          },
        ],
      });
      
      // Also disable cache for API routes
      headers.push({
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, private',
          },
        ],
      });
    }
    
    return headers;
  },
};

export default nextConfig;
