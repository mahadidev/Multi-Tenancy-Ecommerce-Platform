import { Website, WebsitePage, Product } from '@/types';

const API_BASE = '/api';
// Client-side code should always disable cache for dynamic content
const DISABLE_CACHE = true;
const CACHE_REVALIDATE_TIME = 0;
const ENABLE_CACHE_BUSTING = true;

export class ApiClient {
  private static instance: ApiClient;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getFetchOptions(): RequestInit {
    // Always disable caching for dynamic content
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    
    return {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Disable-Cache': '1',
        'X-Timestamp': timestamp.toString(),
        'X-Random': random,
        'If-None-Match': '',
        'If-Modified-Since': '',
        // Add unique request identifier
        'X-Request-ID': `${timestamp}-${random}`,
      },
      // Force Next.js to not cache
      next: { revalidate: 0 }
    };
  }

  async getWebsite(subdomain: string, path: string = ''): Promise<{ website: Website; page: WebsitePage }> {
    const params = new URLSearchParams({
      subdomain,
      path,
      // Always add cache busting parameters
      _t: Date.now().toString(),
      _r: Math.random().toString()
    });

    const url = `${API_BASE}/website?${params}`;
    
    const response = await fetch(url, this.getFetchOptions());
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch website');
    }

    const result = await response.json();
    return result.data;
  }

  async getProducts(subdomain: string, filters: Record<string, any> = {}): Promise<Product[]> {
    const params = new URLSearchParams({ 
      subdomain,
      // Always add cache busting parameters
      _t: Date.now().toString(),
      _r: Math.random().toString()
    });
    
    // Only add filters that have defined values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    const url = `${API_BASE}/products?${params}`;
    
    const response = await fetch(url, this.getFetchOptions());
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch products');
    }

    const result = await response.json();
    return result.data;
  }

  async searchProducts(subdomain: string, query: string, filters: Record<string, any> = {}): Promise<Product[]> {
    const params = new URLSearchParams({ 
      subdomain,
      q: query,
      // Always add cache busting parameters
      _t: Date.now().toString(),
      _r: Math.random().toString()
    });
    
    // Only add filters that have defined values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    const url = `${API_BASE}/products?${params}`;
    
    const response = await fetch(url, this.getFetchOptions());
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search products');
    }

    const result = await response.json();
    return result.data;
  }

  async submitForm(subdomain: string, formId: number, data: Record<string, any>): Promise<any> {
    const params = new URLSearchParams({
      subdomain,
      formId: formId.toString(),
      // Always add cache busting parameters
      _t: Date.now().toString(),
      _r: Math.random().toString()
    });

    const url = `${API_BASE}/form?${params}`;
    
    const options = this.getFetchOptions();
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit form');
    }

    return await response.json();
  }

  async executeHook(subdomain: string, hook: string, params: Record<string, any> = {}, context: Record<string, any> = {}): Promise<any> {
    const searchParams = new URLSearchParams({
      subdomain,
      // Always add cache busting parameters
      _t: Date.now().toString(),
      _r: Math.random().toString()
    });

    const url = `${API_BASE}/hooks?${searchParams}`;
    
    const options = this.getFetchOptions();
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
      },
      body: JSON.stringify({
        hook,
        params,
        context
      })
    });
    
    if (!response.ok) {
      // Try to parse error as JSON, fallback to text if not JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to execute hook');
      } else {
        // Don't log - let the hook executor handle this gracefully
        throw new Error('Hook endpoint not available');
      }
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Hook API returned non-JSON response');
      return {
        success: false,
        message: 'Hook endpoint not available'
      };
    }

    return await response.json();
  }

  // Clear browser cache programmatically
  clearCache(): void {
    if (typeof window === 'undefined') return;
    
    // Clear localStorage
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }

    // Clear sessionStorage
    try {
      window.sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e);
    }

    // Clear service worker cache if available
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      }).catch(e => {
        console.warn('Could not clear cache:', e);
      });
    }

    console.log('✅ Browser cache cleared');
  }

  // Force reload without cache
  forceReload(): void {
    if (typeof window === 'undefined') return;
    
    this.clearCache();
    
    // Force hard refresh
    window.location.reload();
  }
}

export const apiClient = ApiClient.getInstance();