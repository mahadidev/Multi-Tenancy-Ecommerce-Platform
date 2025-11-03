import { Product } from './product';

// Wishlist related types
export interface WishlistItem {
  id: string | number;
  product_id: string | number;
  product: Product;
  created_at?: string;
}

export interface Wishlist {
  items: WishlistItem[];
  count: number;
}