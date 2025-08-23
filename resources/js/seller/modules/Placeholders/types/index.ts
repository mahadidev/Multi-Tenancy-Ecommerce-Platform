import { ApiResponseType } from '@type/apiType';

// Core Types
export interface Placeholder {
  id: number | string;
  name: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'json' | 'number';
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaceholderFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'key' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PlaceholderFormData {
  name: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'json' | 'number';
  description?: string;
  is_active: boolean;
}

export interface PlaceholderCreateFormData extends PlaceholderFormData {}

export interface PlaceholderUpdateFormData extends Partial<PlaceholderFormData> {
  id: number | string;
}

// API Response Types
export interface PlaceholdersResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    placeholders: Placeholder[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface PlaceholderResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    placeholder: Placeholder;
  };
}

export interface PlaceholderCreateResponse extends ApiResponseType {
  data: {
    placeholder: Placeholder;
  };
}

export interface PlaceholderUpdateResponse extends ApiResponseType {
  data: {
    placeholder: Placeholder;
  };
}

export interface PlaceholderDeleteResponse extends ApiResponseType {}

// Payload Types
export interface PlaceholderCreatePayload {
  name: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'json' | 'number';
  description?: string;
  is_active: boolean;
}

export interface PlaceholderUpdatePayload {
  id: number | string;
  name?: string;
  key?: string;
  value?: string;
  type?: 'text' | 'html' | 'json' | 'number';
  description?: string;
  is_active?: boolean;
}

export interface PlaceholderDeletePayload {
  id: number | string;
}

// State Types
export interface PlaceholdersState {
  placeholders: Placeholder[];
  selectedPlaceholder: Placeholder | null;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  filters: PlaceholderFilters;
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}