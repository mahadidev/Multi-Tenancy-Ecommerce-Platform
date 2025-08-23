export interface ProductStock {
  id: number;
  product_id: number;
  price: number;
  buying_price: number;
  discount_amount: number;
  qty: number;
  tax: number;
  sku: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  stock_items: ProductStockItem[];
}

export interface ProductStockItem {
  id: number;
  stock_id: number;
  variant_option_id: number | null;
  created_at: string;
  updated_at: string;
  variant_option: ProductVariantOption | null;
  variant: ProductVariant;
}

export interface ProductVariantOption {
  id: number;
  label: string;
  updated_at: string;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  label: string;
  options: ProductVariantOption[];
  updated_at: string;
  created_at: string;
}

export interface ProductStockHistory {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    thumbnail: string | null;
    stockBuyingValue: number;
    stockValue: number;
  };
  product_stock_id: number;
  qty: number;
  price: number;
  discount_amount: number;
  buying_price: number;
  tax: number;
  note: string | null;
  type: 'added' | 'deleted' | 'adjusted';
  created_at: string;
  updated_at: string;
}

export interface ProductStockSummary {
  qty: number;
  buyingValue: number;
  sellingValue: number;
}

export interface StockFilters {
  page?: number;
  limit?: number;
  search?: string;
  range?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
  sort_by?: 'created_at' | 'qty' | 'price';
  sort_order?: 'asc' | 'desc';
}

// API Response Types
export interface ProductStocksResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    stocks: ProductStock[];
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ProductStockResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    stock: ProductStock;
  };
}

export interface ProductStockHistoryResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    histories: ProductStockHistory[];
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ProductStockSummaryResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    summary: ProductStockSummary;
  };
}

// Payload Types
export interface FetchProductStockPayload {
  productId: number | string;
}

export interface CreateProductStockPayload {
  productId: number | string;
  stock: {
    price: number;
    buying_price: number;
    discount_amount?: number;
    qty: number;
    tax: number;
    sku: string;
    note?: string;
    items?: {
      variant_option_id: number;
    }[];
  };
}

export interface UpdateProductStockPayload {
  productId: number | string;
  stock: {
    id: number | string;
    price: number;
    buying_price: number;
    discount_amount?: number;
    qty: number;
    tax: number;
    sku: string;
    note?: string;
    items?: {
      variant_option_id: number;
    }[];
  };
}

export interface DeleteProductStockPayload {
  productId: number | string;
  stockId: number | string;
}

export interface FetchStockHistoryPayload {
  range?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
  limit?: number;
  page?: number;
}

export interface FetchStockSummaryPayload {
  range?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
}