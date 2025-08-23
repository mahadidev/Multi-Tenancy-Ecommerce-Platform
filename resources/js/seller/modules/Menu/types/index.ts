export interface Menu {
  id: number;
  name: string;
  url: string;
  target?: '_blank' | '_self';
  parent_id?: number;
  parent?: Menu;
  children?: Menu[];
  sort_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuFilters {
  page?: number;
  limit?: number;
  search?: string;
  parent_id?: number | null;
  is_active?: boolean;
  sort_by?: 'name' | 'sort_order' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface MenuFormData {
  name: string;
  url: string;
  target?: '_blank' | '_self';
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

// API Response Types
export interface MenusResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    menus: Menu[];
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

export interface MenuResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    menu: Menu;
  };
}

// Payload Types
export interface CreateMenuPayload {
  name: string;
  url: string;
  target?: '_blank' | '_self';
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateMenuPayload {
  id: number;
  name?: string;
  url?: string;
  target?: '_blank' | '_self';
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface DeleteMenuPayload {
  id: number;
}