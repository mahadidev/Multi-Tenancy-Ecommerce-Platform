import { Website, WebsitePage, Product } from '@/types';

const API_BASE = '/api';

export class ApiClient {
  private static instance: ApiClient;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async getWebsite(subdomain: string, path: string = ''): Promise<{ website: Website; page: WebsitePage }> {
    const params = new URLSearchParams({
      subdomain,
      path
    });

    const apiUrl = `${API_BASE}/website?${params}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch website');
    }

    const result = await response.json();
    return result.data;
  }

  async getProducts(subdomain: string, filters: Record<string, any> = {}): Promise<Product[]> {
    const params = new URLSearchParams({ subdomain });
    
    // Only add filters that have defined values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE}/products?${params}`);
    
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
      q: query 
    });
    
    // Only add filters that have defined values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE}/products?${params}`);
    
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
      formId: formId.toString()
    });

    const response = await fetch(`${API_BASE}/form?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit form');
    }

    return await response.json();
  }
}

export const apiClient = ApiClient.getInstance();