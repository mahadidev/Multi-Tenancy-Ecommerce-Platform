export interface Theme {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  preview_url?: string;
  is_active: boolean;
  is_premium?: boolean;
  price?: number;
  version?: string;
  author?: string;
  created_at: string;
  updated_at: string;
}

export interface ThemeFilters {
  page?: number;
  limit?: number;
  search?: string;
  is_premium?: boolean;
  sort_by?: 'name' | 'created_at' | 'price';
  sort_order?: 'asc' | 'desc';
}

// API Response Types
export interface ThemesResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    themes: Theme[];
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

export interface ThemeResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    theme: Theme;
  };
}

// Payload Types
export interface FetchThemePayload {
  slug?: string;
  id?: number;
}

export interface ActivateThemePayload {
  theme_id: number;
}

export interface InstallThemePayload {
  theme_slug: string;
  purchase_code?: string;
}