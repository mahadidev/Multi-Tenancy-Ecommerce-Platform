import { ThemeHooks, User, Cart, Product, WishlistItem, AuthResponse, CartResponse } from '../../types';

// Placeholder OrderResponse type
interface OrderResponse {
  success: boolean;
  order?: any;
  orderId?: string;
  message: string;
}

/**
 * Production Provider - For live websites
 * Uses real APIs for all operations
 * Full functionality with actual transactions
 */
export class ProductionProvider implements ThemeHooks {
  private apiBase: string;
  private token: string | null = null;
  private user: User | null = null;

  constructor(config: { apiBase: string; token?: string }) {
    this.apiBase = config.apiBase || '/api/v1/site';
    this.token = config.token || null;
    
    // Load auth state from localStorage
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedToken) this.token = savedToken;
      if (savedUser) this.user = JSON.parse(savedUser);
    }
  }

  private async fetchAPI(endpoint: string, options?: RequestInit): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.apiBase}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  private saveAuthState() {
    if (typeof window !== 'undefined') {
      if (this.token) {
        localStorage.setItem('auth_token', this.token);
      } else {
        localStorage.removeItem('auth_token');
      }
      
      if (this.user) {
        localStorage.setItem('auth_user', JSON.stringify(this.user));
      } else {
        localStorage.removeItem('auth_user');
      }
    }
  }

  auth = {
    login: async (credentials: any): Promise<AuthResponse> => {
      try {
        const response = await this.fetchAPI('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        });
        
        this.token = response.data.token;
        this.user = response.data.user;
        this.saveAuthState();
        
        return {
          success: true,
          user: this.user!,
          token: this.token!,
          message: 'Login successful'
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Login failed'
        };
      }
    },

    logout: async () => {
      try {
        await this.fetchAPI('/auth/logout', { method: 'POST' });
      } catch {
        // Continue with local logout even if API call fails
      }
      
      this.token = null;
      this.user = null;
      this.saveAuthState();
    },

    register: async (data: any): Promise<AuthResponse> => {
      try {
        const response = await this.fetchAPI('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        
        this.token = response.data.token;
        this.user = response.data.user;
        this.saveAuthState();
        
        return {
          success: true,
          user: this.user!,
          token: this.token!,
          message: 'Registration successful'
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Registration failed'
        };
      }
    },

    getCurrentUser: () => this.user,
    
    isAuthenticated: () => !!this.token && !!this.user
  };

  cart = {
    addToCart: async (product: Product, quantity: number, variant?: string): Promise<CartResponse> => {
      try {
        const response = await this.fetchAPI('/cart/add', {
          method: 'POST',
          body: JSON.stringify({
            product_id: product.id,
            qty: quantity,
            variant: variant
          })
        });
        
        return {
          success: true,
          cart: response.data.cart,
          message: response.message || 'Added to cart'
        };
      } catch (error: any) {
        return {
          success: false,
          cart: await this.cart.getCart(),
          message: error.message || 'Failed to add to cart'
        };
      }
    },

    removeFromCart: async (itemId: string | number): Promise<CartResponse> => {
      try {
        const response = await this.fetchAPI(`/cart/remove/${itemId}`, {
          method: 'DELETE'
        });
        
        return {
          success: true,
          cart: response.data.cart,
          message: 'Item removed from cart'
        };
      } catch (error: any) {
        return {
          success: false,
          cart: await this.cart.getCart(),
          message: error.message || 'Failed to remove item'
        };
      }
    },

    updateQuantity: async (itemId: string | number, quantity: number): Promise<CartResponse> => {
      try {
        const response = await this.fetchAPI('/cart/update', {
          method: 'PUT',
          body: JSON.stringify({
            cart_id: itemId,
            qty: quantity
          })
        });
        
        return {
          success: true,
          cart: response.data.cart,
          message: 'Quantity updated'
        };
      } catch (error: any) {
        return {
          success: false,
          cart: await this.cart.getCart(),
          message: error.message || 'Failed to update quantity'
        };
      }
    },

    getCart: async (): Promise<Cart> => {
      try {
        const response = await this.fetchAPI('/cart');
        return response.data;
      } catch {
        return {
          items: [],
          total: 0,
          subtotal: 0,
          count: 0
        };
      }
    },

    clearCart: async () => {
      try {
        await this.fetchAPI('/cart/clear', { method: 'DELETE' });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    },

    getCartCount: () => {
      // This would typically be cached/stored in state management
      return 0;
    }
  };

  checkout = {
    processOrder: async (data: any): Promise<OrderResponse> => {
      try {
        const response = await this.fetchAPI('/orders/place', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        
        return {
          success: true,
          order: response.data,
          message: response.message || 'Order placed successfully'
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to process order'
        };
      }
    },

    calculateShipping: async (address: any) => {
      try {
        const response = await this.fetchAPI('/shipping/calculate', {
          method: 'POST',
          body: JSON.stringify({ address })
        });
        return response.data;
      } catch {
        return [];
      }
    },

    applyCoupon: async (code: string) => {
      try {
        const response = await this.fetchAPI('/coupons/apply', {
          method: 'POST',
          body: JSON.stringify({ code })
        });
        return response.data;
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Invalid coupon'
        };
      }
    },

    getPaymentMethods: async () => {
      try {
        const response = await this.fetchAPI('/payment/methods');
        return response.data;
      } catch {
        return [];
      }
    },

    getShippingMethods: async () => {
      try {
        const response = await this.fetchAPI('/shipping/methods');
        return response.data;
      } catch {
        return [];
      }
    }
  };

  wishlist = {
    addToWishlist: async (productId: string | number) => {
      try {
        await this.fetchAPI('/wishlist/add', {
          method: 'POST',
          body: JSON.stringify({ product_id: productId })
        });
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        throw error;
      }
    },

    removeFromWishlist: async (productId: string | number) => {
      try {
        await this.fetchAPI(`/wishlist/remove/${productId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        throw error;
      }
    },

    getWishlist: async (): Promise<WishlistItem[]> => {
      try {
        const response = await this.fetchAPI('/wishlist');
        return response.data;
      } catch {
        return [];
      }
    },

    isInWishlist: (productId: string | number): boolean => {
      // This would typically be cached in state management
      return false;
    }
  };

  products = {
    getProducts: async (filters?: any): Promise<Product[]> => {
      try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.brand) params.append('brand', filters.brand);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
        if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
        if (filters?.sort) params.append('sort', filters.sort);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.page) params.append('page', filters.page.toString());
        
        const response = await this.fetchAPI(`/products?${params.toString()}`);
        return response.data;
      } catch {
        return [];
      }
    },

    getProduct: async (slug: string): Promise<Product> => {
      const response = await this.fetchAPI(`/products/${slug}`);
      return response.data;
    },

    searchProducts: async (query: string): Promise<Product[]> => {
      try {
        const response = await this.fetchAPI(`/products/search?q=${encodeURIComponent(query)}`);
        return response.data;
      } catch {
        return [];
      }
    },

    getFeaturedProducts: async (): Promise<Product[]> => {
      try {
        const response = await this.fetchAPI('/products/featured');
        return response.data;
      } catch {
        return [];
      }
    },

    getRelatedProducts: async (productId: string | number): Promise<Product[]> => {
      try {
        const response = await this.fetchAPI(`/products/${productId}/related`);
        return response.data;
      } catch {
        return [];
      }
    }
  };

  store = {
    getStoreInfo: async () => {
      try {
        const response = await this.fetchAPI('/store');
        return response.data;
      } catch {
        return null;
      }
    },

    getCategories: async () => {
      try {
        const response = await this.fetchAPI('/categories');
        return response.data;
      } catch {
        return [];
      }
    },

    getBrands: async () => {
      try {
        const response = await this.fetchAPI('/brands');
        return response.data;
      } catch {
        return [];
      }
    },

    getMenus: async () => {
      try {
        const response = await this.fetchAPI('/menus');
        return response.data;
      } catch {
        return [];
      }
    }
  };
}