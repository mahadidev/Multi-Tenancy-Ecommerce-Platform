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
    // For testing, use the mock endpoint
    if (subdomain === 'test-store') {
      const response = await fetch(`http://localhost:8000/test-website-data`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch test website data');
      }

      const result = await response.json();
      return result.data;
    }

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
    const params = new URLSearchParams({
      subdomain,
      ...filters
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
      q: query,
      ...filters
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