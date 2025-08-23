import { StoreType as BaseStoreType, StoreTypesType } from '@type/storeType';
import { StoreAdminType } from '@type/storeAdminType';

// Core Types
export interface Store extends BaseStoreType {}

export interface StoreType extends StoreTypesType {}

export interface StoreAdmin extends StoreAdminType {}

export interface StoreFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  type?: string;
  sort_by?: 'name' | 'created_at' | 'domain';
  sort_order?: 'asc' | 'desc';
}

export interface StoreFormData {
  name: string;
  slug?: string;
  domain: string;
  email?: string;
  phone?: string;
  location?: string;
  status?: 1 | 0;
  type?: string;
  description?: string;
  currency?: string;
  logo?: string;
  dark_logo?: string;
  primary_color?: string;
  secondary_color?: string;
  theme_id?: number;
}

export interface StoreAdminFormData {
  name: string;
  email: string;
  password?: string;
  role?: string;
  permissions?: string[];
}

// API Response Types
export interface StoresResponse {
  success: boolean;
  message?: string;
  data: {
    stores: Store[];
    current_store: Store;
  };
}

export interface StoreResponse {
  success: boolean;
  message?: string;
  data: {
    store: Store;
  };
}

export interface StoreTypesResponse {
  success: boolean;
  message?: string;
  data: {
    store_types: StoreType[];
  };
}

export interface StoreAdminsResponse {
  success: boolean;
  message?: string;
  data: {
    store_admins: StoreAdmin[];
  };
}

export interface StoreAdminResponse {
  success: boolean;
  message?: string;
  data: {
    store_admin: StoreAdmin;
  };
}

// Payload Types
export interface CreateStorePayload {
  name: string;
  slug?: string;
  domain: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  theme_id?: number;
}

export interface UpdateStorePayload {
  id: number;
  name?: string;
  slug?: string;
  domain?: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  status?: 1 | 0;
  type?: string;
  description?: string | null;
  currency?: string;
  logo?: string;
  dark_logo?: string;
  primary_color?: null | string;
  secondary_color?: null | string;
  theme_id?: number | "none";
}

export interface SwitchStorePayload {
  store_id: number;
}

export interface SwitchThemePayload {
  theme_id: number | null;
  store_id: number;
  import_demo: boolean;
}

export interface CreateStoreAdminPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  permissions?: string[];
}

export interface UpdateStoreAdminPayload {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  permissions?: string[];
}

export interface DeleteStoreAdminPayload {
  id: number;
}

// State Types
export interface StoreState {
  store: Store | null;
  currentStore: Store | null;
  stores: Store[] | null;
  storeTypes: StoreType[];
  admins: StoreAdmin[];
  loading: boolean;
  error: string | null;
}