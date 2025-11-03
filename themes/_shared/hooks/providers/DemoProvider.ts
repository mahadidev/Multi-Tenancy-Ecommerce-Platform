import { ThemeHooks, User, Cart, CartItem, Product, WishlistItem } from '../../types';

/**
 * Demo Provider - For sellers previewing the theme
 * Uses seller's actual products but with simulated cart/checkout
 * Fetches real data from seller's store but doesn't perform actual transactions
 */
export class DemoProvider implements ThemeHooks {
  private storeId: string;
  private apiBase: string;
  private user: User | null = null;
  private cartItems: CartItem[] = [];
  protected wishlistItems: WishlistItem[] = [];

  constructor(config: { storeId: string; apiBase?: string }) {
    this.storeId = config.storeId;
    this.apiBase = config.apiBase || '/api/v1/seller';
    
    // Load demo state from sessionStorage
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem(`demo_cart_${this.storeId}`);
      const savedWishlist = sessionStorage.getItem(`demo_wishlist_${this.storeId}`);
      
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          this.cartItems = Array.isArray(parsed) ? parsed : [];
        } catch {
          this.cartItems = [];
        }
      }
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          this.wishlistItems = Array.isArray(parsed) ? parsed : [];
        } catch {
          this.wishlistItems = [];
        }
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`demo_cart_${this.storeId}`, JSON.stringify(this.cartItems));
      sessionStorage.setItem(`demo_wishlist_${this.storeId}`, JSON.stringify(this.wishlistItems));
    }
  }

  private async fetchAPI(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Store-ID': this.storeId,
        ...options?.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  auth = {
    login: async (credentials: any) => {
      // Demo mode - simulate login without actual authentication
      this.user = {
        id: 'demo-user',
        name: 'Demo Seller',
        email: credentials.email
      };
      
      return {
        success: true,
        user: this.user,
        message: 'Demo login successful (no actual authentication)',
        demo: true
      };
    },

    logout: async () => {
      this.user = null;
    },

    register: async (data: any) => {
      // Demo mode - simulate registration
      this.user = {
        id: 'demo-user',
        name: data.name,
        email: data.email
      };
      
      return {
        success: true,
        user: this.user,
        message: 'Demo registration (no actual account created)',
        demo: true
      };
    },

    getCurrentUser: () => this.user,
    isAuthenticated: () => !!this.user
  };

  cart = {
    addToCart: async (product: Product, quantity: number, variant?: string) => {
      // Demo mode - add to local cart without API call
      const existingItem = this.cartItems.find(item => 
        item.product.id === product.id && item.variant === variant
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        this.cartItems.push({
          id: `demo-cart-${Date.now()}`,
          product,
          quantity,
          variant,
          price: product.discount_price || product.price,
          subtotal: quantity * (product.discount_price || product.price)
        });
      }

      this.saveState();
      
      // Show demo notification
      return {
        success: true,
        cart: await this.cart.getCart(),
        message: `[DEMO] ${product.name} would be added to cart`,
        demo: true
      };
    },

    removeFromCart: async (itemId: string | number) => {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.saveState();
      
      return {
        success: true,
        cart: await this.cart.getCart(),
        message: '[DEMO] Item removed from cart',
        demo: true
      };
    },

    updateQuantity: async (itemId: string | number, quantity: number) => {
      const item = this.cartItems.find(item => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.price;
      }
      this.saveState();
      
      return {
        success: true,
        cart: await this.cart.getCart(),
        message: '[DEMO] Quantity updated',
        demo: true
      };
    },

    getCart: async (): Promise<Cart> => {
      const total = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const itemCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
      
      return {
        items: this.cartItems,
        total,
        subtotal: total,
        count: itemCount,
        shipping: total > 50 ? 0 : 10,
        tax: total * 0.08
      };
    },

    clearCart: async () => {
      this.cartItems = [];
      this.saveState();
    },

    getCartCount: () => {
      if (!Array.isArray(this.cartItems)) {
        this.cartItems = [];
      }
      return this.cartItems.reduce((count, item) => count + item.quantity, 0);
    }
  };

  checkout = {
    processOrder: async (data: any) => {
      // Demo mode - simulate order without actual processing
      const orderId = `DEMO-${Date.now()}`;
      
      return {
        success: true,
        order: {
          id: orderId,
          ...data,
          status: 'demo',
          message: 'This is a demo order - no actual order was placed'
        },
        message: `[DEMO] Order ${orderId} would be processed in production`
      };
    },

    calculateShipping: async (address: any) => {
      // Use real shipping methods from store
      try {
        const methods = await this.fetchAPI('/shipping/methods');
        return methods.data || [
          { method: 'standard', cost: 10, days: '5-7' },
          { method: 'express', cost: 20, days: '2-3' }
        ];
      } catch {
        return [
          { method: 'standard', cost: 10, days: '5-7' },
          { method: 'express', cost: 20, days: '2-3' }
        ];
      }
    },

    applyCoupon: async (code: string) => {
      // Demo mode - simulate coupon
      return {
        success: false,
        message: '[DEMO] Coupons disabled in preview mode'
      };
    },

    getPaymentMethods: async () => {
      // Return store's actual payment methods
      try {
        const methods = await this.fetchAPI('/payment/methods');
        return methods.data || [
          { id: 'demo', name: 'Demo Payment', icon: 'credit-card' }
        ];
      } catch {
        return [
          { id: 'demo', name: 'Demo Payment', icon: 'credit-card' }
        ];
      }
    },

    getShippingMethods: async () => {
      try {
        const methods = await this.fetchAPI('/shipping/methods');
        return methods.data || [
          { id: 'standard', name: 'Standard Shipping', cost: 10, days: '5-7' }
        ];
      } catch {
        return [
          { id: 'standard', name: 'Standard Shipping', cost: 10, days: '5-7' }
        ];
      }
    }
  };

  wishlist = {
    addToWishlist: async (productId: string | number) => {
      // Demo mode - local wishlist
      try {
        const product = await this.products.getProduct(productId.toString());
        if (!this.wishlistItems.find(item => item.product.id === productId)) {
          this.wishlistItems.push({
            id: `demo-wish-${Date.now()}`,
            product,
            product_id: product.id,
            created_at: new Date().toISOString()
          });
          this.saveState();
        }
      } catch (error) {
        console.error('[DEMO] Failed to add to wishlist:', error);
      }
    },

    removeFromWishlist: async (productId: string | number) => {
      this.wishlistItems = this.wishlistItems.filter(item => item.product.id !== productId);
      this.saveState();
    },

    getWishlist: async () => this.wishlistItems,

    isInWishlist: (productId: string | number) => {
      return this.wishlistItems.some(item => item.product.id === productId);
    }
  };

  products = {
    getProducts: async (filters?: any) => {
      // Fetch seller's actual products
      try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        
        const response = await this.fetchAPI(`/products?${params.toString()}`);
        return response.data || [];
      } catch (error) {
        console.error('[DEMO] Failed to fetch products:', error);
        return [];
      }
    },

    getProduct: async (slug: string) => {
      try {
        const response = await this.fetchAPI(`/products/${slug}`);
        return response.data;
      } catch (error) {
        throw new Error(`Product not found: ${slug}`);
      }
    },

    searchProducts: async (query: string) => {
      try {
        const response = await this.fetchAPI(`/products/search?q=${encodeURIComponent(query)}`);
        return response.data || [];
      } catch {
        return [];
      }
    },

    getFeaturedProducts: async () => {
      try {
        const response = await this.fetchAPI('/products?featured=true');
        return response.data || [];
      } catch {
        return [];
      }
    },

    getRelatedProducts: async (productId: string | number) => {
      try {
        const response = await this.fetchAPI(`/products/${productId}/related`);
        return response.data || [];
      } catch {
        return [];
      }
    }
  };

  store = {
    getStoreInfo: async () => {
      try {
        const response = await this.fetchAPI('/store/info');
        return response.data;
      } catch (error) {
        console.error('[DEMO] Failed to fetch store info:', error);
        return null;
      }
    },

    getCategories: async () => {
      try {
        const response = await this.fetchAPI('/categories');
        return response.data || [];
      } catch {
        return [];
      }
    },

    getBrands: async () => {
      try {
        const response = await this.fetchAPI('/brands');
        return response.data || [];
      } catch {
        return [];
      }
    },

    getMenus: async () => {
      try {
        const response = await this.fetchAPI('/menus');
        return response.data || [];
      } catch {
        return [];
      }
    }
  };
}