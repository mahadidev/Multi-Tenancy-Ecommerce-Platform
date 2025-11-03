import { ThemeHooks, User, Cart, CartItem, Product, WishlistItem } from '../../types';
import productsData from '../../data/products.json';
import categoriesData from '../../data/categories.json';
import storeData from '../../data/store.json';

/**
 * Preview Provider - For theme designers
 * Uses completely dummy data from JSON files
 * No real API calls, everything is simulated
 */
export class PreviewProvider implements ThemeHooks {
  private user: User | null = null;
  private cartItems: CartItem[] = [];
  protected wishlistItems: WishlistItem[] = [];
  private productsData: Product[] = [];
  private categoriesData = categoriesData;

  constructor() {
    // Initialize products data
    this.productsData = Array.isArray(productsData) ? productsData as Product[] : [];
    
    // Load saved state from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('preview_cart');
      const savedWishlist = localStorage.getItem('preview_wishlist');
      const savedUser = localStorage.getItem('preview_user');
      
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
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch {
          this.user = null;
        }
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preview_cart', JSON.stringify(this.cartItems));
      localStorage.setItem('preview_wishlist', JSON.stringify(this.wishlistItems));
      localStorage.setItem('preview_user', JSON.stringify(this.user));
    }
  }

  auth = {
    login: async (credentials: any) => {
      // Simulate login with dummy user
      this.user = {
        id: '1',
        name: 'Demo User',
        email: credentials.email,
        avatar: 'https://placehold.co/100x100/1e40af/ffffff?text=DU'
      };
      this.saveState();
      return {
        success: true,
        user: this.user,
        token: 'preview-token-123',
        message: 'Login successful (preview mode)'
      };
    },

    logout: async () => {
      this.user = null;
      this.saveState();
    },

    register: async (data: any) => {
      this.user = {
        id: '1',
        name: data.name,
        email: data.email
      };
      this.saveState();
      return {
        success: true,
        user: this.user,
        token: 'preview-token-123',
        message: 'Registration successful (preview mode)'
      };
    },

    getCurrentUser: () => this.user,
    
    isAuthenticated: () => !!this.user
  };

  cart = {
    addToCart: async (product: Product, quantity: number, variant?: string) => {
      const existingItem = this.cartItems.find(item => 
        item.product.id === product.id && item.variant === variant
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        this.cartItems.push({
          id: `cart-${Date.now()}`,
          product,
          quantity,
          variant,
          price: product.discount_price || product.price,
          subtotal: quantity * (product.discount_price || product.price)
        });
      }

      this.saveState();
      
      return {
        success: true,
        cart: await this.cart.getCart(),
        message: `${product.name} added to cart (preview)`,
        demo: true
      };
    },

    removeFromCart: async (itemId: string | number) => {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.saveState();
      
      return {
        success: true,
        cart: await this.cart.getCart(),
        message: 'Item removed from cart'
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
        message: 'Quantity updated'
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
      // Simulate order processing
      const orderId = `ORD-PREVIEW-${Date.now()}`;
      this.cartItems = []; // Clear cart after order
      this.saveState();
      
      return {
        success: true,
        order: {
          id: orderId,
          ...data,
          status: 'pending',
          total: data.items.reduce((sum: number, item: any) => sum + item.subtotal, 0)
        },
        message: `Order ${orderId} placed successfully (preview mode)`
      };
    },

    calculateShipping: async (address: any) => {
      // Return dummy shipping rates
      return [
        { id: 'standard', name: 'Standard Shipping', cost: 10, days: '5-7' },
        { id: 'express', name: 'Express Shipping', cost: 20, days: '2-3' },
        { id: 'overnight', name: 'Overnight Shipping', cost: 35, days: '1' }
      ];
    },

    applyCoupon: async (code: string) => {
      // Simulate coupon application
      if (code === 'PREVIEW10') {
        return { success: true, discount: 10, message: '10% discount applied' };
      }
      return { success: false, message: 'Invalid coupon code' };
    },

    getPaymentMethods: async () => [
      { id: 'credit_card', name: 'Credit Card', icon: 'credit-card' },
      { id: 'paypal', name: 'PayPal', icon: 'paypal' },
      { id: 'stripe', name: 'Stripe', icon: 'stripe' }
    ],

    getShippingMethods: async () => [
      { id: 'standard', name: 'Standard Shipping', cost: 10, days: '5-7' },
      { id: 'express', name: 'Express Shipping', cost: 20, days: '2-3' },
      { id: 'overnight', name: 'Overnight', cost: 35, days: '1' }
    ]
  };

  wishlist = {
    addToWishlist: async (productId: string | number) => {
      const product = this.productsData.find(p => p.id === productId);
      if (product && !this.wishlistItems.find(item => item.product.id === productId)) {
        this.wishlistItems.push({
          id: `wish-${Date.now()}`,
          product,
          product_id: product.id,
          created_at: new Date().toISOString()
        });
        this.saveState();
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
      let filtered = [...this.productsData];
      
      if (filters?.category) {
        filtered = filtered.filter(p => p.category?.slug === filters.category);
      }
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
        );
      }
      
      if (filters?.minPrice) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
      }
      
      if (filters?.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
      }
      
      return filtered;
    },

    getProduct: async (slug: string) => {
      const product = this.productsData.find(p => p.slug === slug);
      if (!product) throw new Error('Product not found');
      return product;
    },

    searchProducts: async (query: string) => {
      const search = query.toLowerCase();
      return this.productsData.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    },

    getFeaturedProducts: async () => {
      return this.productsData.filter(p => p.is_featured);
    },

    getRelatedProducts: async (productId: string | number) => {
      const product = this.productsData.find(p => p.id === productId);
      if (!product) return [];
      
      // Return products from same category
      return this.productsData
        .filter(p => p.category?.id === product.category?.id && p.id !== productId)
        .slice(0, 4);
    }
  };

  store = {
    getStoreInfo: async () => storeData,
    
    getCategories: async () => categoriesData,
    
    getBrands: async () => {
      // Extract unique brands from products
      const brands = new Map();
      this.productsData.forEach(p => {
        if (p.brand && typeof p.brand === 'object' && 'id' in p.brand) {
          brands.set(p.brand.id, p.brand);
        }
      });
      return Array.from(brands.values());
    },
    
    getMenus: async () => {
      // Return menus from demo.json
      return [
        {
          name: 'main-menu',
          items: [
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ]
        }
      ];
    }
  };
}