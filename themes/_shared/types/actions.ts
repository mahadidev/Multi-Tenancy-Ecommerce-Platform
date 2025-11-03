// Action types for theme components
// These can be implemented differently in preview, demo, and production modes

import { Product } from './product';

export interface CartActions {
  add: (product: Product, quantity?: number, variant?: string) => Promise<void>;
  remove: (itemId: string | number) => Promise<void>;
  update: (itemId: string | number, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  getCount: () => number;
}

export interface WishlistActions {
  add: (product: Product) => Promise<void>;
  remove: (productId: string | number) => Promise<void>;
  toggle: (product: Product) => Promise<boolean>;
  isInWishlist: (productId: string | number) => boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  getCurrentUser: () => { name?: string; email?: string } | null;
  isAuthenticated: () => boolean;
}

export interface SearchActions {
  search: (query: string) => Promise<Product[]>;
  getSuggestions: (query: string) => Promise<string[]>;
}

export interface FormActions {
  submit: (formData: Record<string, any>) => Promise<{ success: boolean; message?: string }>;
  subscribe: (email: string) => Promise<{ success: boolean; message?: string }>;
}

// Complete action set for components
export interface ThemeActions {
  cart: CartActions;
  wishlist: WishlistActions;
  auth: AuthActions;
  search: SearchActions;
  form: FormActions;
}

// Component props that include actions
export interface ActionableComponentProps {
  actions?: Partial<ThemeActions>;
}

// Helper to get default no-op actions for missing implementations
export const getDefaultActions = (): ThemeActions => ({
  cart: {
    add: async () => console.log('Cart add not implemented'),
    remove: async () => console.log('Cart remove not implemented'),
    update: async () => console.log('Cart update not implemented'),
    clear: async () => console.log('Cart clear not implemented'),
    getCount: () => 0
  },
  wishlist: {
    add: async () => console.log('Wishlist add not implemented'),
    remove: async () => console.log('Wishlist remove not implemented'),
    toggle: async () => { console.log('Wishlist toggle not implemented'); return false; },
    isInWishlist: () => false
  },
  auth: {
    login: async () => ({ success: false, message: 'Login not implemented' }),
    logout: async () => console.log('Logout not implemented'),
    register: async () => ({ success: false, message: 'Register not implemented' }),
    getCurrentUser: () => null,
    isAuthenticated: () => false
  },
  search: {
    search: async () => [],
    getSuggestions: async () => []
  },
  form: {
    submit: async () => ({ success: false, message: 'Form submission not implemented' }),
    subscribe: async () => ({ success: false, message: 'Subscribe not implemented' })
  }
});