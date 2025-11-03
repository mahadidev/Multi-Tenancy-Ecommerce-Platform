import { User, LoginCredentials, RegisterData, AuthResponse } from './auth';
import { Product } from './product';
import { Cart, CartItem, CartResponse } from './cart';
import { WishlistItem } from './wishlist';
import { OrderResponse, ShippingMethod, PaymentMethod } from './checkout';

// Hook interfaces for theme providers
export interface ThemeHooks {
  // Authentication hooks
  auth: {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<AuthResponse>;
    getCurrentUser: () => User | null;
    isAuthenticated: () => boolean;
  };
  
  // Cart hooks
  cart: {
    addToCart: (product: Product, quantity: number, variant?: string) => Promise<CartResponse>;
    removeFromCart: (itemId: string | number) => Promise<CartResponse>;
    updateQuantity: (itemId: string | number, quantity: number) => Promise<CartResponse>;
    getCart: () => Promise<Cart>;
    clearCart: () => Promise<void>;
    getCartCount: () => number;
  };
  
  // Checkout hooks
  checkout: {
    processOrder: (data: any) => Promise<OrderResponse>;
    calculateShipping: (address: any) => Promise<ShippingMethod[]>;
    applyCoupon: (code: string) => Promise<any>;
    getPaymentMethods: () => Promise<PaymentMethod[]>;
    getShippingMethods: () => Promise<ShippingMethod[]>;
  };

  // Product hooks
  products: {
    getProducts: (filters?: any) => Promise<Product[]>;
    getProduct: (slug: string) => Promise<Product>;
    searchProducts: (query: string) => Promise<Product[]>;
    getFeaturedProducts: () => Promise<Product[]>;
    getRelatedProducts: (productId: string | number) => Promise<Product[]>;
  };
  
  // Wishlist hooks
  wishlist: {
    addToWishlist: (productId: string | number) => Promise<void>;
    removeFromWishlist: (productId: string | number) => Promise<void>;
    getWishlist: () => Promise<WishlistItem[]>;
    isInWishlist: (productId: string | number) => boolean;
  };
  
  // Store hooks
  store: {
    getStoreInfo: () => Promise<any>;
    getCategories: () => Promise<any[]>;
    getBrands: () => Promise<any[]>;
    getMenus: () => Promise<any[]>;
  };
}