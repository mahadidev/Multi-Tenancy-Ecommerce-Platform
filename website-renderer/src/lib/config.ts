/**
 * Environment configuration for URLs and API endpoints
 */

// Public URLs (accessible in client-side code)
export const config = {
  // Frontend URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // Environment info
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Server-side only configuration
export const serverConfig = {
  // Laravel backend API
  LARAVEL_API_BASE: process.env.LARAVEL_API_BASE || 'http://localhost:8000/api',
  
  // Cache settings
  DISABLE_CACHE: process.env.DISABLE_CACHE === 'true',
  CACHE_REVALIDATE_TIME: parseInt(process.env.CACHE_REVALIDATE_TIME || '300'),
  ENABLE_CACHE_BUSTING: process.env.ENABLE_CACHE_BUSTING === 'true',
} as const;

/**
 * Get the base URL for the current environment
 */
export function getBaseUrl(): string {
  return config.APP_URL;
}

/**
 * Get the API base URL for frontend requests
 */
export function getApiBaseUrl(): string {
  return config.API_URL;
}

/**
 * Build a full URL for a given path
 */
export function buildUrl(path: string): string {
  const baseUrl = config.APP_URL.endsWith('/') ? config.APP_URL.slice(0, -1) : config.APP_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Build a full API URL for a given path
 */
export function buildApiUrl(path: string): string {
  const apiUrl = config.API_URL.endsWith('/') ? config.API_URL.slice(0, -1) : config.API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiUrl}${cleanPath}`;
}