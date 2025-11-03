// Base Cart Actions Interface
import { Product } from '../../types';

export interface CartActions {
  add: (product: Product, quantity?: number, variant?: string) => Promise<void>;
  remove: (itemId: string | number) => Promise<void>;
  update: (itemId: string | number, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  getCount: () => number;
}

export interface CartItem {
  id: string | number;
  product: Product;
  quantity: number;
  variant?: string;
  price: number;
  subtotal: number;
}