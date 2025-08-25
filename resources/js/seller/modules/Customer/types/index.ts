export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  image?: string;
  address: string;
  password?: string;
  confirm_password?: string;
  created_at?: string;
  updated_at?: string;
}

import type { ServerTableFilters } from '@seller/_hooks/types/table';

export interface CustomerFilters extends ServerTableFilters {
  limit?: number;
  sort_by?: 'name' | 'email' | 'created_at';
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  image?: File;
  address: string;
  password?: string;
  confirm_password?: string;
}

// API Response Types (following existing pattern)
export interface CustomersResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    customers: Customer[];
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

export interface CustomerResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    customer: Customer;
  };
}

// Payload Types (following existing pattern)
export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  confirm_password?: string;
}

export interface UpdateCustomerPayload {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  confirm_password?: string;
}

export interface DeleteCustomerPayload {
  id: number;
}