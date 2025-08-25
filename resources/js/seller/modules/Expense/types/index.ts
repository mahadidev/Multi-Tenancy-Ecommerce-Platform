export interface Vendor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  vendor_id: number;
  vendor?: Vendor;
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

import type { ServerTableFilters } from '@seller/_hooks/types/table';

export interface ExpenseFilters extends ServerTableFilters {
  limit?: number;
  vendor_id?: number;
  category?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: 'amount' | 'date' | 'created_at';
}

export interface VendorFilters extends ServerTableFilters {
  limit?: number;
  sort_by?: 'name' | 'email' | 'created_at';
}

// API Response Types
export interface ExpensesResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    expenses: Expense[];
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

export interface VendorsResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    vendors: Vendor[];
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

// Payload Types
export interface CreateExpensePayload {
  vendor_id: number;
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export interface UpdateExpensePayload {
  id: number;
  vendor_id?: number;
  category?: string;
  amount?: number;
  description?: string;
  date?: string;
}

export interface DeleteExpensePayload {
  id: number;
}

export interface CreateVendorPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateVendorPayload {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DeleteVendorPayload {
  id: number;
}