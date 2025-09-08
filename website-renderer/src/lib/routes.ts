'use client';

import { usePathname } from 'next/navigation';

export interface RouteConfig {
  path: string;
  name: string;
  type: 'page' | 'product' | 'category' | 'external' | 'custom';
  params?: Record<string, string>;
}

/**
 * Route helper for website navigation
 */
export class RouteHelper {
  private subdomain: string;
  private basePath: string;

  constructor(subdomain: string) {
    this.subdomain = subdomain;
    this.basePath = '';
  }

  /**
   * Build URL for a page slug
   */
  buildPageUrl(slug: string, params?: Record<string, string>): string {
    // For development with subdomain in query params
    let url = slug === 'home' || slug === '' ? '/' : `/${slug}`;
    
    const searchParams = new URLSearchParams();
    
    // Always include subdomain
    searchParams.set('subdomain', this.subdomain);
    
    // Add additional params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
    }
    
    url += `?${searchParams.toString()}`;
    return url;
  }

  /**
   * Build URL for a product
   */
  buildProductUrl(productSlug: string): string {
    return `/product/${productSlug}?subdomain=${this.subdomain}`;
  }

  /**
   * Build URL for a category
   */
  buildCategoryUrl(categorySlug: string): string {
    return `/category/${categorySlug}?subdomain=${this.subdomain}`;
  }

  /**
   * Parse menu item URL based on type
   */
  parseMenuItemUrl(item: any): string {
    switch (item.type) {
      case 'page':
        if (item.page_slug) {
          return this.buildPageUrl(item.page_slug);
        }
        // If no page_slug but we have a URL that looks like a page path, 
        // convert it to use subdomain parameter
        if (item.url && item.url.startsWith('/')) {
          const slug = item.url === '/' ? 'home' : item.url.substring(1);
          return this.buildPageUrl(slug);
        }
        return item.url || '#';
      
      case 'product':
        if (item.product_slug) {
          return this.buildProductUrl(item.product_slug);
        }
        return item.url || '#';
      
      case 'category':
        if (item.category_slug) {
          return this.buildCategoryUrl(item.category_slug);
        }
        return item.url || '#';
      
      case 'external':
      case 'custom':
      default:
        return item.url || '#';
    }
  }

  /**
   * Check if current path matches a route
   */
  isActive(currentPath: string, itemPath: string): boolean {
    // Remove query parameters for comparison
    const cleanCurrentPath = (currentPath || '/').split('?')[0];
    const cleanItemPath = (itemPath || '/').split('?')[0];
    
    // Exact match
    if (cleanCurrentPath === cleanItemPath) {
      return true;
    }
    
    // Home page variations
    if ((cleanCurrentPath === '/' || cleanCurrentPath === '') && 
        (cleanItemPath === '/' || cleanItemPath === '' || cleanItemPath === '/home')) {
      return true;
    }
    
    // Partial match for nested routes
    if (cleanCurrentPath.startsWith(cleanItemPath) && cleanItemPath !== '/') {
      return true;
    }
    
    return false;
  }

  /**
   * Get breadcrumb trail for current path
   */
  getBreadcrumbs(currentPath: string, menus: any[]): Array<{name: string, url: string}> {
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    
    // Find matching menu item
    for (const menu of menus) {
      const item = this.findMenuItemByPath(menu.items, currentPath);
      if (item) {
        // Add parent items if nested
        const parents = this.getMenuItemParents(menu.items, item.id);
        parents.forEach(parent => {
          breadcrumbs.push({
            name: parent.title,
            url: this.parseMenuItemUrl(parent)
          });
        });
        
        // Add current item
        breadcrumbs.push({
          name: item.title,
          url: this.parseMenuItemUrl(item)
        });
        break;
      }
    }
    
    return breadcrumbs;
  }

  /**
   * Find menu item by path
   */
  private findMenuItemByPath(items: any[], path: string): any | null {
    for (const item of items) {
      const itemUrl = this.parseMenuItemUrl(item);
      if (this.isActive(path, itemUrl)) {
        return item;
      }
      
      if (item.children) {
        const found = this.findMenuItemByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Get parent menu items for nested navigation
   */
  private getMenuItemParents(items: any[], itemId: number): any[] {
    const parents: any[] = [];
    
    const findParents = (menuItems: any[], targetId: number, currentParents: any[] = []): boolean => {
      for (const item of menuItems) {
        if (item.id === targetId) {
          parents.push(...currentParents);
          return true;
        }
        
        if (item.children) {
          if (findParents(item.children, targetId, [...currentParents, item])) {
            return true;
          }
        }
      }
      return false;
    };
    
    findParents(items, itemId);
    return parents;
  }
}

/**
 * React hook for route management
 */
export function useRoutes(subdomain: string) {
  const pathname = usePathname();
  const routeHelper = new RouteHelper(subdomain);

  return {
    // Route building
    buildPageUrl: routeHelper.buildPageUrl.bind(routeHelper),
    buildProductUrl: routeHelper.buildProductUrl.bind(routeHelper),
    buildCategoryUrl: routeHelper.buildCategoryUrl.bind(routeHelper),
    parseMenuItemUrl: routeHelper.parseMenuItemUrl.bind(routeHelper),
    
    // Navigation state
    isActive: (itemPath: string) => routeHelper.isActive(pathname, itemPath),
    getCurrentPath: () => pathname,
    
    // Breadcrumbs
    getBreadcrumbs: (menus: any[]) => routeHelper.getBreadcrumbs(pathname, menus),
    
    // Utilities
    routeHelper,
    pathname
  };
}

/**
 * Route constants
 */
export const ROUTE_TYPES = {
  PAGE: 'page',
  PRODUCT: 'product', 
  CATEGORY: 'category',
  EXTERNAL: 'external',
  CUSTOM: 'custom'
} as const;

export type RouteType = typeof ROUTE_TYPES[keyof typeof ROUTE_TYPES];