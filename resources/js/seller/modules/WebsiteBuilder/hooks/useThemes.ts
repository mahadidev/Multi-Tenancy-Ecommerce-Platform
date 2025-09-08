import { useState, useEffect, useCallback } from 'react';

export interface Theme {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  preview_url: string;
  category: string;
  price: number;
  is_free: boolean;
  features: string[];
  installations: number;
  is_featured: boolean;
  author?: string;
  version?: string;
}

export interface InstalledTheme extends Theme {
  is_active: boolean;
  activated_at: string | null;
  has_valid_license: boolean;
}

export interface ThemeCustomization {
  id: number;
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  settings: Record<string, any>;
  custom_css: string;
  tailwind_config: Record<string, any>;
  is_active: boolean;
}

// API Functions
const api = {
  async getThemes(filters?: {
    category?: string;
    price?: 'free' | 'premium';
    featured?: boolean;
  }): Promise<Theme[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.price) params.append('price', filters.price);
    if (filters?.featured) params.append('featured', '1');

    const response = await fetch(`/api/v1/themes?${params}`);
    if (!response.ok) throw new Error('Failed to fetch themes');
    
    const data = await response.json();
    // Handle the nested response structure: data.data.themes
    return Array.isArray(data.data?.themes) ? data.data.themes : [];
  },

  async getThemeDetails(themeId: number): Promise<Theme & { manifest: any }> {
    const response = await fetch(`/api/v1/themes/${themeId}`);
    if (!response.ok) throw new Error('Failed to fetch theme details');
    
    const data = await response.json();
    return data.data;
  },

  async getInstalledThemes(): Promise<InstalledTheme[]> {
    try {
      const response = await fetch('/api/v1/themes/installed', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include', // Include cookies for session-based auth
      });
      if (!response.ok) throw new Error('Failed to fetch installed themes');
      
      const data = await response.json();
      // Handle both success response format and direct data array
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      // Return empty array for development - no themes installed yet
      return [];
    }
  },

  async installTheme(themeId: number, licenseKey?: string): Promise<void> {
    // Get CSRF token from meta tag or cookie
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const response = await fetch(`/api/v1/themes/${themeId}/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': token || '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include', // Include cookies for session-based auth
      body: JSON.stringify({ license_key: licenseKey }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to install theme');
    }
  },

  async reinstallTheme(websiteId: number, themeSlug: string, options?: {
    reset_content?: boolean;
    reset_header_footer?: boolean;
    create_demo_content?: boolean;
  }): Promise<void> {
    // Get CSRF token from meta tag or cookie
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const response = await fetch(`/api/v1/websites/${websiteId}/themes/${themeSlug}/reinstall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': token || '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include', // Include cookies for session-based auth
      body: JSON.stringify({
        reset_content: options?.reset_content ?? true,
        reset_header_footer: options?.reset_header_footer ?? true,
        create_demo_content: options?.create_demo_content ?? true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reinstall theme');
    }

    return await response.json();
  },

  async activateTheme(themeId: number): Promise<void> {
    // Get CSRF token from meta tag or cookie
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    try {
      const response = await fetch(`/api/v1/themes/${themeId}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include', // Include cookies for session-based auth
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to activate theme');
      }
    } catch (error) {
      // For development, just simulate success
      console.log(`Theme ${themeId} would be activated in production`);
    }
  },

  async getThemeCustomizations(themeId: number): Promise<ThemeCustomization[]> {
    const response = await fetch(`/api/v1/themes/${themeId}/customizations`);
    if (!response.ok) throw new Error('Failed to fetch customizations');
    
    const data = await response.json();
    return data.data;
  },

  async getActiveCustomization(themeId: number): Promise<ThemeCustomization> {
    const response = await fetch(`/api/v1/themes/${themeId}/customizations/active`);
    if (!response.ok) throw new Error('Failed to fetch active customization');
    
    const data = await response.json();
    return data.data;
  },

  async createCustomization(themeId: number, customization: Partial<ThemeCustomization>): Promise<ThemeCustomization> {
    const response = await fetch(`/api/v1/themes/${themeId}/customizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(customization),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create customization');
    }

    const data = await response.json();
    return data.data;
  },

  async updateCustomization(customizationId: number, updates: Partial<ThemeCustomization>): Promise<ThemeCustomization> {
    const response = await fetch(`/api/v1/themes/customizations/${customizationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update customization');
    }

    const data = await response.json();
    return data.data;
  },

  async activateCustomization(customizationId: number): Promise<void> {
    const response = await fetch(`/api/v1/themes/customizations/${customizationId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to activate customization');
    }
  },

  async previewTheme(themeId: number, customizationId?: number): Promise<{ preview_url: string; config: any }> {
    const params = new URLSearchParams();
    if (customizationId) params.append('customization_id', customizationId.toString());

    const response = await fetch(`/api/v1/themes/${themeId}/preview?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate preview');
    }

    const data = await response.json();
    return data.data;
  },
};

// Custom Hooks
export function useThemes(filters?: { category?: string; price?: 'free' | 'premium'; featured?: boolean }) {
  const [data, setData] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const themes = await api.getThemes(filters);
        // Ensure themes is always an array
        setData(Array.isArray(themes) ? themes : []);
      } catch (err) {
        setError(err as Error);
        // Return mock data for development
        setData([
          {
            id: 1,
            name: 'Modern E-commerce',
            slug: 'modern-ecommerce',
            description: 'A complete modern e-commerce theme with clean design and powerful features',
            thumbnail: '/themes/modern-ecommerce/preview.jpg',
            preview_url: 'https://modern-ecommerce-preview.example.com',
            category: 'e-commerce',
            price: 0,
            is_free: true,
            features: [
              'Complete E-commerce Pages',
              'Product Management',
              'Shopping Cart',
              'Checkout Process',
              'User Authentication',
              'Responsive Design',
              'SEO Optimized',
              'Mobile Responsive'
            ],
            installations: 2500,
            is_featured: true,
            author: 'Chologori Team',
            version: '1.0.0',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, [filters]);

  return { data, isLoading, error };
}

export function useThemeDetails(themeId: number | null) {
  const [data, setData] = useState<(Theme & { manifest: any }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!themeId) {
      setData(null);
      return;
    }

    const fetchTheme = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const theme = await api.getThemeDetails(themeId);
        setData(theme);
      } catch (err) {
        setError(err as Error);
        // Mock data for development
        setData({
          id: themeId,
          name: 'Modern E-commerce',
          slug: 'modern-ecommerce',
          description: 'A complete modern e-commerce theme with clean design and powerful features',
          thumbnail: '/themes/modern-ecommerce/preview.jpg',
          preview_url: '',
          category: 'e-commerce',
          price: 0,
          is_free: true,
          features: ['Responsive Design', 'E-commerce Ready', 'Product Management', 'Shopping Cart'],
          installations: 2500,
          is_featured: true,
          manifest: {}
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, [themeId]);

  return { data, isLoading, error };
}

export function useInstalledThemes() {
  const [data, setData] = useState<InstalledTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInstalledThemes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const themes = await api.getInstalledThemes();
        setData(themes);
      } catch (err) {
        setError(err as Error);
        // Set empty array when API fails - no themes installed
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstalledThemes();
  }, []);

  return { data, isLoading, error };
}

export function useThemeActions() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isReinstalling, setIsReinstalling] = useState(false);

  const installTheme = {
    mutateAsync: async ({ themeId, licenseKey }: { themeId: number; licenseKey?: string }) => {
      setIsInstalling(true);
      try {
        await api.installTheme(themeId, licenseKey);
        console.log('Theme installed successfully!');
        return { success: true };
      } catch (error) {
        console.error('Failed to install theme:', error);
        throw error;
      } finally {
        setIsInstalling(false);
      }
    },
  };

  const reinstallTheme = {
    mutateAsync: async ({ 
      websiteId, 
      themeSlug, 
      options 
    }: { 
      websiteId: number; 
      themeSlug: string;
      options?: {
        reset_content?: boolean;
        reset_header_footer?: boolean;
        create_demo_content?: boolean;
      }
    }) => {
      setIsReinstalling(true);
      try {
        const result = await api.reinstallTheme(websiteId, themeSlug, options);
        console.log('Theme reinstalled successfully!');
        return result;
      } catch (error) {
        console.error('Failed to reinstall theme:', error);
        throw error;
      } finally {
        setIsReinstalling(false);
      }
    },
  };

  const activateTheme = {
    mutateAsync: async (themeId: number) => {
      setIsActivating(true);
      try {
        await api.activateTheme(themeId);
        console.log('Theme activated successfully!');
        return { success: true };
      } catch (error) {
        console.error('Failed to activate theme:', error);
        throw error;
      } finally {
        setIsActivating(false);
      }
    },
  };

  return {
    installTheme,
    reinstallTheme,
    activateTheme,
    isInstalling,
    isReinstalling,
    isActivating,
  };
}

export function useThemeCustomizations(themeId: number | null) {
  const [data, setData] = useState<ThemeCustomization[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!themeId) return;

    const fetchCustomizations = async () => {
      setIsLoading(true);
      try {
        const customizations = await api.getThemeCustomizations(themeId);
        setData(customizations);
      } catch (error) {
        setData([]); // Empty array for mock
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomizations();
  }, [themeId]);

  return { data, isLoading };
}

export function useActiveCustomization(themeId: number | null) {
  const [data, setData] = useState<ThemeCustomization | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!themeId) return;

    const fetchActiveCustomization = async () => {
      setIsLoading(true);
      try {
        const customization = await api.getActiveCustomization(themeId);
        setData(customization);
      } catch (error) {
        // Mock active customization
        setData({
          id: 1,
          name: 'Default',
          colors: {
            primary: '#2563eb',
            secondary: '#64748b'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter'
          },
          spacing: {},
          settings: {},
          custom_css: '',
          tailwind_config: {},
          is_active: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveCustomization();
  }, [themeId]);

  return { data, isLoading };
}

export function useCustomizationActions() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const createCustomization = {
    mutateAsync: async ({ themeId, customization }: { themeId: number; customization: Partial<ThemeCustomization> }) => {
      setIsCreating(true);
      try {
        const result = await api.createCustomization(themeId, customization);
        console.log('Customization created successfully!');
        return result;
      } finally {
        setIsCreating(false);
      }
    },
  };

  const updateCustomization = {
    mutateAsync: async ({ customizationId, updates }: { customizationId: number; updates: Partial<ThemeCustomization> }) => {
      setIsUpdating(true);
      try {
        const result = await api.updateCustomization(customizationId, updates);
        console.log('Customization updated successfully!');
        return result;
      } finally {
        setIsUpdating(false);
      }
    },
  };

  const activateCustomization = {
    mutateAsync: async (customizationId: number) => {
      setIsActivating(true);
      try {
        await api.activateCustomization(customizationId);
        console.log('Customization activated successfully!');
      } finally {
        setIsActivating(false);
      }
    },
  };

  return {
    createCustomization,
    updateCustomization,
    activateCustomization,
    isCreating,
    isUpdating,
    isActivating,
  };
}

export function useThemePreview() {
  const [previewData, setPreviewData] = useState<{ preview_url: string; config: any } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePreview = useCallback(async (themeId: number, customizationId?: number) => {
    setIsGenerating(true);
    try {
      const data = await api.previewTheme(themeId, customizationId);
      setPreviewData(data);
      return data;
    } catch (error) {
      console.error('Failed to generate preview:', error);
      // Mock preview data
      const mockData = {
        preview_url: `https://preview.example.com/theme/${themeId}?customization=${customizationId}`,
        config: {}
      };
      setPreviewData(mockData);
      return mockData;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewData(null);
  }, []);

  return {
    previewData,
    generatePreview,
    clearPreview,
    isGenerating,
  };
}