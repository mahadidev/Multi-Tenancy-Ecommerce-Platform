import { Product } from './product';

// Cart related types
export interface CartItem {
  id: string | number;
  product: Product;
  quantity: number;
  variant?: string;
  variant_id?: string | number;
  price: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  count: number;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}