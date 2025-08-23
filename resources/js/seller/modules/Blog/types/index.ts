export interface Blog {
  id: number;
  title: string;
  slug: string;
  image: string;
  content: string;
  status: string;
  user_id: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category_id?: number;
  sort_by?: 'title' | 'created_at' | 'status';
  sort_order?: 'asc' | 'desc';
}

export interface BlogFormData {
  title: string;
  slug?: string;
  image?: File;
  content: string;
  status?: string;
  category_id?: number;
}

// API Response Types (following existing pattern)
export interface BlogsResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    blogs: Blog[];
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

export interface BlogResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    blog: Blog;
  };
}

// Payload Types (following existing pattern)
export interface CreateBlogPayload {
  title: string;
  slug?: string;
  image?: any;
  content: string;
  status?: string;
  category_id?: number;
}

export interface UpdateBlogPayload {
  id: number;
  title?: string;
  slug?: string;
  image?: any;
  content?: string;
  status?: string;
  category_id?: number;
}

export interface DeleteBlogPayload {
  id: number;
}