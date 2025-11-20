export interface Vendor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  contact_person?: string;
  store_id: number;
  store?: {
    id: number;
    name: string;
  };
  created_at: string;
  created_at_human: string;
  updated_at: string;
  updated_at_human: string;
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  formatted_amount: string;
  category: string;
  category_label: string;
  payment_method: string;
  payment_method_label: string;
  vendor_id?: number;
  vendor?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
  };
  receipt_number?: string;
  expense_date: string;
  expense_date_formatted: string;
  status: 'pending' | 'approved' | 'rejected';
  status_label: string;
  status_color: string;
  notes?: string;
  attachments: {
    path: string;
    url: string;
    name: string;
    extension: string;
  }[];
  store?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  created_at_human: string;
  updated_at: string;
  updated_at_human: string;
}

import type { ServerTableFilters } from '@seller/_hooks/types/table';

export interface ExpenseFilters extends ServerTableFilters {
  limit?: number;
  vendor_id?: number;
  category?: string;
  date_from?: string;
  date_to?: string;
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
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
  title: string;
  description?: string;
  amount: number;
  category: string;
  payment_method: string;
  vendor_id?: number;
  receipt_number?: string;
  expense_date: string;
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface UpdateExpensePayload {
  id: number;
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  payment_method?: string;
  vendor_id?: number;
  receipt_number?: string;
  expense_date?: string;
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface DeleteExpensePayload {
  id: number;
}

export interface CreateVendorPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  contact_person?: string;
}

export interface UpdateVendorPayload {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  contact_person?: string;
}

export interface DeleteVendorPayload {
  id: number;
}