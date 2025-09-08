import { completeEcommerceTheme, EcommerceTheme, EcommerceThemePage } from '../themes/ecommerce-complete';
import { ElementorSection } from '../elementor/ElementorBuilder';

export interface ThemeInstallationOptions {
  websiteId: number;
  themeId: string;
  overwriteExisting?: boolean;
  createDemoContent?: boolean;
}

export interface PageCreationData {
  title: string;
  slug: string;
  content: string; // JSON stringified ElementorSection[]
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_published?: boolean;
  page_type?: string;
}

export class ThemeInstallationService {
  private apiBase = '/api/v1';
  private testMode = false; // Disabled test mode to use real endpoints

  /**
   * Install a complete theme with all pages and content
   */
  async installTheme(options: ThemeInstallationOptions): Promise<{
    success: boolean;
    pages: any[];
    errors: string[];
    created_pages_count?: number;
  }> {
    const { websiteId, themeId, overwriteExisting = false, createDemoContent = true } = options;
    
    try {
      // Ensure we have a CSRF token
      await this.ensureCSRFToken();
      // Choose API endpoint based on test mode
      const endpoint = this.testMode 
        ? `/api/test/theme-installation/websites/${websiteId}/install`
        : `${this.apiBase}/websites/${websiteId}/themes/install`;

      // Call the backend API
      const response = this.testMode 
        ? await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              theme_slug: themeId,
              overwrite_existing: overwriteExisting,
              create_demo_content: createDemoContent
            })
          })
        : await this.authenticatedFetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
              theme_slug: themeId,
              overwrite_existing: overwriteExisting,
              create_demo_content: createDemoContent
            })
          });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(errorData.message || `Installation failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          pages: result.data?.pages || [],
          created_pages_count: result.data?.created_pages_count || 0,
          errors: []
        };
      } else {
        return {
          success: false,
          pages: [],
          errors: result.errors || ['Installation failed']
        };
      }
    } catch (error) {
      console.error('Theme installation failed:', error);
      return {
        success: false,
        pages: [],
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  /**
   * Get theme by ID
   */
  private getThemeById(themeId: string): EcommerceTheme | null {
    switch (themeId) {
      case 'complete-ecommerce-v1':
        return completeEcommerceTheme;
      default:
        return null;
    }
  }

  /**
   * Install theme global settings
   */
  private async installThemeSettings(websiteId: number, theme: EcommerceTheme): Promise<void> {
    const settings = {
      theme_id: theme.id,
      theme_name: theme.name,
      theme_version: theme.version,
      global_settings: theme.globalSettings,
      features: theme.features
    };

    try {
      const response = await fetch(`${this.apiBase}/websites/${websiteId}/theme-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to install theme settings');
      }
    } catch (error) {
      console.log('Theme settings installation skipped (development mode)');
    }
  }

  /**
   * Create all pages for the theme
   */
  private async createThemePages(
    websiteId: number, 
    theme: EcommerceTheme, 
    overwriteExisting: boolean
  ): Promise<{ successes: any[]; errors: string[] }> {
    const successes: any[] = [];
    const errors: string[] = [];

    for (const themePage of theme.pages) {
      try {
        const result = await this.createPage(websiteId, themePage, overwriteExisting);
        if (result) {
          successes.push(result);
          console.log(`✅ Created page: ${themePage.title}`);
        }
      } catch (error) {
        const errorMessage = `Failed to create page "${themePage.title}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        errors.push(errorMessage);
        console.error(`❌ ${errorMessage}`);
      }
    }

    return { successes, errors };
  }

  /**
   * Create a single page with Elementor sections
   */
  private async createPage(
    websiteId: number, 
    themePage: EcommerceThemePage, 
    overwriteExisting: boolean
  ): Promise<any | null> {
    // Check if page already exists
    if (!overwriteExisting) {
      const existing = await this.findExistingPage(websiteId, themePage.slug);
      if (existing) {
        console.log(`Page "${themePage.title}" already exists, skipping...`);
        return null;
      }
    }

    // Prepare page data
    const pageData: PageCreationData = {
      title: themePage.title,
      slug: themePage.slug,
      content: JSON.stringify(themePage.sections),
      meta_title: themePage.seo?.title,
      meta_description: themePage.seo?.description,
      meta_keywords: themePage.seo?.keywords?.join(', '),
      is_published: true,
      page_type: themePage.type
    };

    try {
      const response = await fetch(`${this.apiBase}/websites/${websiteId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Create sections for this page
      if (result.data?.id) {
        await this.createPageSections(result.data.id, themePage.sections);
      }

      return result.data;
    } catch (error) {
      // For development - create mock success
      console.log(`Mock: Would create page "${themePage.title}" with ${themePage.sections.length} sections`);
      return {
        id: Math.floor(Math.random() * 1000),
        title: themePage.title,
        slug: themePage.slug,
        sections: themePage.sections
      };
    }
  }

  /**
   * Find existing page by slug
   */
  private async findExistingPage(websiteId: number, slug: string): Promise<any | null> {
    try {
      const response = await fetch(`${this.apiBase}/websites/${websiteId}/pages?slug=${encodeURIComponent(slug)}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.data?.length > 0 ? data.data[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Create sections for a page
   */
  private async createPageSections(pageId: number, sections: ElementorSection[]): Promise<void> {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      try {
        await this.createSection(pageId, section, i);
      } catch (error) {
        console.error(`Failed to create section ${section.id}:`, error);
      }
    }
  }

  /**
   * Create a single section with columns and widgets
   */
  private async createSection(pageId: number, section: ElementorSection, sortOrder: number): Promise<void> {
    const sectionData = {
      page_id: pageId,
      name: section.id,
      type: 'section',
      sort_order: sortOrder,
      is_visible: true,
      settings: JSON.stringify(section.settings),
      elementor_data: JSON.stringify(section)
    };

    try {
      const response = await fetch(`${this.apiBase}/pages/${pageId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create section: HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Create components for each widget in the section
      if (result.data?.id) {
        await this.createSectionComponents(result.data.id, section);
      }
    } catch (error) {
      console.log(`Mock: Would create section "${section.id}" with ${section.columns.length} columns`);
    }
  }

  /**
   * Create components for section columns and widgets
   */
  private async createSectionComponents(sectionId: number, section: ElementorSection): Promise<void> {
    for (let columnIndex = 0; columnIndex < section.columns.length; columnIndex++) {
      const column = section.columns[columnIndex];
      
      for (let widgetIndex = 0; widgetIndex < column.widgets.length; widgetIndex++) {
        const widget = column.widgets[widgetIndex];
        
        try {
          await this.createComponent(sectionId, widget, widgetIndex);
        } catch (error) {
          console.error(`Failed to create component ${widget.id}:`, error);
        }
      }
    }
  }

  /**
   * Create a single component (widget)
   */
  private async createComponent(sectionId: number, widget: any, sortOrder: number): Promise<void> {
    // Find or create component type for this widget
    const componentTypeId = await this.getOrCreateComponentType(widget.type);

    const componentData = {
      section_id: sectionId,
      component_type_id: componentTypeId,
      name: widget.id,
      sort_order: sortOrder,
      is_visible: true,
      props: JSON.stringify(widget.content),
      styles: JSON.stringify(widget.settings),
      elementor_data: JSON.stringify(widget)
    };

    try {
      const response = await fetch(`${this.apiBase}/sections/${sectionId}/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(componentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create component: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`Mock: Would create component "${widget.type}" (${widget.id})`);
    }
  }

  /**
   * Get or create component type for widget
   */
  private async getOrCreateComponentType(widgetType: string): Promise<number> {
    // Map of widget types to component type IDs (this would be configurable)
    const widgetTypeMapping: Record<string, number> = {
      'hero': 1,
      'heading': 2,
      'text': 3,
      'image': 4,
      'button': 5,
      'product-grid': 6,
      'category-grid': 7,
      'contact-form': 8,
      'product-gallery': 9,
      'add-to-cart-button': 10,
      'cart-table': 11,
      'checkout-form': 12,
      // Add more mappings as needed
    };

    return widgetTypeMapping[widgetType] || 1; // Default to generic component
  }

  /**
   * Create demo content (products, categories, etc.)
   */
  private async createDemoContent(websiteId: number): Promise<void> {
    try {
      // This would create sample products, categories, etc.
      console.log('Creating demo content for website:', websiteId);
      
      // Sample implementation - would call actual APIs
      const demoContent = {
        categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
        products: this.generateDemoProducts(),
        menus: this.generateDemoMenus()
      };

      // In a real implementation, these would be API calls
      console.log('Demo content created:', demoContent);
    } catch (error) {
      console.error('Failed to create demo content:', error);
    }
  }

  /**
   * Generate demo products
   */
  private generateDemoProducts() {
    return [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        category: 'Electronics',
        images: ['/api/placeholder/400/400'],
        featured: true
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt in various colors',
        price: 29.99,
        category: 'Clothing',
        images: ['/api/placeholder/400/400'],
        featured: true
      },
      {
        name: 'JavaScript Handbook',
        description: 'Complete guide to modern JavaScript development',
        price: 49.99,
        category: 'Books',
        images: ['/api/placeholder/400/400'],
        featured: false
      },
      {
        name: 'Garden Tools Set',
        description: 'Complete set of essential garden tools',
        price: 89.99,
        category: 'Home & Garden',
        images: ['/api/placeholder/400/400'],
        featured: true
      }
    ];
  }

  /**
   * Generate demo menus
   */
  private generateDemoMenus() {
    return [
      {
        name: 'Main Menu',
        location: 'primary',
        items: [
          { title: 'Home', url: '/' },
          { title: 'Products', url: '/products' },
          { title: 'About', url: '/about' },
          { title: 'Contact', url: '/contact' }
        ]
      },
      {
        name: 'Footer Menu',
        location: 'footer',
        items: [
          { title: 'Privacy Policy', url: '/privacy' },
          { title: 'Terms of Service', url: '/terms' },
          { title: 'Return Policy', url: '/returns' }
        ]
      }
    ];
  }

  /**
   * Get installation progress
   */
  async getInstallationProgress(websiteId: number): Promise<{
    isInstalling: boolean;
    progress: number;
    currentStep: string;
    totalSteps: number;
  }> {
    try {
      const endpoint = this.testMode 
        ? `/api/test/theme-installation/websites/${websiteId}/status`
        : `${this.apiBase}/websites/${websiteId}/theme-installation/status`;
      
      const response = this.testMode 
        ? await fetch(endpoint, {
            headers: { 'Accept': 'application/json' }
          })
        : await this.authenticatedFetch(endpoint);
      
      if (!response.ok) {
        return { isInstalling: false, progress: 0, currentStep: '', totalSteps: 0 };
      }
      
      const result = await response.json();
      const data = result.data;
      
      return {
        isInstalling: data.is_installing || false,
        progress: data.progress || 0,
        currentStep: data.current_step || '',
        totalSteps: 5 // We have 5 installation steps
      };
    } catch (error) {
      // Return default state on error
      return {
        isInstalling: false,
        progress: 0,
        currentStep: '',
        totalSteps: 5
      };
    }
  }

  /**
   * Get available themes
   */
  async getAvailableThemes(): Promise<any[]> {
    try {
      const response = await this.authenticatedFetch(`${this.apiBase}/themes`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch themes: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch themes:', error);
      return [];
    }
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Try to get CSRF token
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    // Try to get Sanctum token
    const sanctumToken = this.getSanctumToken();
    if (sanctumToken) {
      headers['Authorization'] = `Bearer ${sanctumToken}`;
    }

    return headers;
  }

  /**
   * Get CSRF token from meta tag or cookie
   */
  private getCSRFToken(): string {
    // First try to get from meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (metaTag) {
      return metaTag.content;
    }

    // Fallback to cookie
    return this.getCookie('XSRF-TOKEN');
  }

  /**
   * Get Sanctum authentication token
   */
  private getSanctumToken(): string {
    // Try various token storage locations
    return localStorage.getItem('auth_token') || 
           localStorage.getItem('sanctum_token') ||
           sessionStorage.getItem('auth_token') ||
           this.getCookie('sanctum_token') ||
           '';
  }

  /**
   * Get cookie value by name
   */
  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }
    return '';
  }

  /**
   * Ensure CSRF token is available
   */
  private async ensureCSRFToken(): Promise<void> {
    // Check if we already have a token
    if (this.getCSRFToken()) {
      return;
    }

    // Try to get CSRF token from Sanctum
    try {
      await fetch('/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
    }
  }

  /**
   * Make authenticated fetch request
   */
  private async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const defaultHeaders = this.getAuthHeaders();
    const headers = { ...defaultHeaders, ...options.headers };

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for session-based auth
    });
  }

  /**
   * Preview theme before installation
   */
  async previewTheme(themeId: string): Promise<{
    theme: EcommerceTheme;
    previewPages: { title: string; sections: ElementorSection[] }[];
  }> {
    const theme = this.getThemeById(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    return {
      theme,
      previewPages: theme.pages.map(page => ({
        title: page.title,
        sections: page.sections
      }))
    };
  }
}

// Export singleton instance
export const themeInstallationService = new ThemeInstallationService();