export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'product' | 'post' | 'blog';
  parent_id?: number;
  parent?: Category;
  has_parent?: Category;
  children?: Category[];
  description?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  sort_order?: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFilters {
  page?: number;
  per_page?: number;
  search?: string;
  type?: 'product' | 'post' | 'blog';
  parent_id?: number | null;
  is_active?: boolean;
  sort_by?: 'name' | 'slug' | 'created_at' | 'updated_at' | 'type';
  sort_order?: 'asc' | 'desc';
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  type?: 'product' | 'post' | 'blog';
  parent_id?: number | null;
  description?: string;
  image?: File;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface CategoryTreeItem extends Category {
  level: number;
  hasChildren: boolean;
  isExpanded?: boolean;
}

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  with_products: number;
  without_products: number;
}

// API Response Types (following existing pattern)
export interface CategoriesResponse {
  success: boolean;
  message?: string;
  data: {
    categories: Category[];
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

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: {
    category: Category;
  };
}

// Payload Types (following existing pattern)
export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  type?: 'product' | 'post' | 'blog';
  parent_id?: number | null;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryPayload {
  id: number;
  name?: string;
  slug?: string;
  type?: 'product' | 'post' | 'blog';
  parent_id?: number | null;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface DeleteCategoryPayload {
  id: number;
}