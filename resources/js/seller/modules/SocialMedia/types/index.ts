export interface SocialMedia {
  id: number;
  name: string;
  label: string;
  username: string;
  url: string;
  store_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialMediaList {
  name: string;
  label: string;
  url: string;
  icon: string;
}

export interface SocialMediaFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// API Response Types
export interface SocialMediasResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    store_social_media: SocialMedia[];
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

export interface SocialMediaResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    social_media: SocialMedia;
  };
}

// Payload Types
export interface CreateSocialMediaPayload {
  name: string;
  url: string;
  username: string;
  label?: string;
}

export interface UpdateSocialMediaPayload {
  id: number;
  name?: string;
  url?: string;
  username?: string;
  label?: string;
}

export interface DeleteSocialMediaPayload {
  id: number;
}