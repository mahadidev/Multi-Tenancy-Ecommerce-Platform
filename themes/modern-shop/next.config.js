/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features disabled to avoid critters dependency
  experimental: {},
  
  // Optimize for theme development
  poweredByHeader: false,
  
  // Custom webpack config to resolve shared modules
  webpack: (config, { isServer }) => {
    // Add alias for shared modules
    config.resolve.alias['@shared'] = require('path').resolve(__dirname, '../_shared');
    
    // Ensure extensions are resolved properly
    config.resolve.extensions = [...(config.resolve.extensions || []), '.tsx', '.ts', '.jsx', '.js'];
    
    return config;
  },
  
  // Optimize CSS and JS
  compress: true,
  
  // Custom port for development
  async rewrites() {
    return [];
  },
  
  // Enable standalone mode for easier deployment
  output: 'standalone',
};

module.exports = nextConfig;