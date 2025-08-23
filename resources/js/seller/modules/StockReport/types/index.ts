export interface StockReportItem {
  id: number;
  product_id: number;
  product_name: string;
  product_thumbnail?: string;
  sku: string;
  category?: string;
  brand?: string;
  current_stock: number;
  stock_value: number;
  buying_price: number;
  selling_price: number;
  low_stock_threshold?: number;
  is_low_stock: boolean;
  last_updated: string;
}

export interface StockReportSummary {
  total_products: number;
  total_stock_value: number;
  total_buying_value: number;
  low_stock_products: number;
  out_of_stock_products: number;
  overstock_products: number;
}

export interface StockReportFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  stock_status?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  date_range?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
  sort_by?: 'product_name' | 'current_stock' | 'stock_value' | 'last_updated';
  sort_order?: 'asc' | 'desc';
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  filters?: StockReportFilters;
  include_summary?: boolean;
}

// API Response Types
export interface StockReportResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    items: StockReportItem[];
    summary: StockReportSummary;
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

export interface ExportResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    download_url: string;
    filename: string;
  };
}

// Payload Types
export interface FetchStockReportPayload {
  filters?: StockReportFilters;
}

export interface ExportStockReportPayload {
  options: ExportOptions;
}