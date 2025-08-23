import { StoreType } from '@type/storeType';
import { ApiResponseType } from '@type/apiType';

// Core Types
export interface Store extends StoreType {}

export interface OnboardFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface OnboardFormData {
  step?: number;
  store_name?: string;
  store_description?: string;
  store_type?: string;
  store_category?: string;
  store_logo?: File | string;
  store_banner?: File | string;
  business_license?: File | string;
  tax_information?: string;
  payment_method?: string;
  bank_account?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  store_address?: string;
  store_city?: string;
  store_state?: string;
  store_postal_code?: string;
  store_country?: string;
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
}

export interface StepOneFormData {
  store_name: string;
  store_description: string;
  store_type: string;
  store_category: string;
}

export interface StepTwoFormData {
  store_logo?: File | string;
  store_banner?: File | string;
  business_license?: File | string;
  tax_information: string;
}

export interface StepThreeFormData {
  payment_method: string;
  bank_account: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  store_address: string;
  store_city: string;
  store_state: string;
  store_postal_code: string;
  store_country: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
}

// API Response Types
export interface OnboardResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    store: Store;
  };
}

export interface OnboardStepResponse extends ApiResponseType {
  data: {
    store: Store;
    current_step: number;
    next_step?: number;
  };
}

// Payload Types
export interface OnboardStepPayload {
  step: number;
  data: StepOneFormData | StepTwoFormData | StepThreeFormData;
}

export interface CreateStorePayload extends OnboardFormData {}

// State Types
export interface OnboardState {
  currentStep: number;
  storeData: Partial<OnboardFormData>;
  completedSteps: number[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
}