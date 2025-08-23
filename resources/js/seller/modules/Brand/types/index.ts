export interface Brand {
  id: number;
  store_id: number;
  name: string;
  slug: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface BrandFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface BrandFormData {
  name: string;
  slug?: string;
  image?: File;
}

// API Response Types (following existing pattern)
export interface BrandsResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    brands: Brand[];
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

export interface BrandResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    brand: Brand;
  };
}

// Payload Types (following existing pattern)
export interface CreateBrandPayload {
  name: string;
  slug?: string;
  image?: any;
}

export interface UpdateBrandPayload {
  id: number;
  name?: string;
  slug?: string;
  image?: any;
}

export interface DeleteBrandPayload {
  id: number;
}