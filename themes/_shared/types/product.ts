// Product related types
export interface Product {
  discount_price: number;
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images?: string[];
  thumbnail?: string;
  category?: ProductCategory | { id: number; name: string; slug: string };
  brand?: ProductBrand | { id: number; name: string } | string;
  stock_quantity?: number;
  stockQty?: number; // Alternative naming for compatibility
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  variants?: ProductVariant[];
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductBrand {
  id: string | number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface ProductVariant {
  id: string | number;
  name: string;
  value: string;
  price_modifier?: number;
  stock_quantity?: number;
}
