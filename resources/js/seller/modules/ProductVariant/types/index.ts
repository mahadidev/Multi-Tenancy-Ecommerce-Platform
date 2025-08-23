export interface ProductVariantOption {
  id: number;
  label: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  label: string;
  options: ProductVariantOption[];
  created_at: string;
  updated_at: string;
}

export interface VariantFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: 'label' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface VariantFormData {
  label: string;
  options?: {
    label: string;
  }[];
}

// API Response Types
export interface ProductVariantsResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    variants: ProductVariant[];
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

export interface ProductVariantResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    variant: ProductVariant;
  };
}

// Payload Types
export interface FetchProductVariantPayload {
  productId: number | string;
}

export interface CreateProductVariantPayload {
  productId: number | string;
  variant: {
    label: string;
    options?: {
      label: string;
    }[];
  };
}

export interface UpdateProductVariantPayload {
  productId: number | string;
  variant: {
    id: number | string;
    label: string;
    options?: {
      label: string;
    }[];
  };
}

export interface DeleteProductVariantPayload {
  productId: number | string;
  variantId: number | string;
}