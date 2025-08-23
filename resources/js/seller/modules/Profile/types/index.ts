import { UserProfileType } from '@type/authType';
import { ApiResponseType } from '@type/apiType';

// Core Types
export interface UserProfile extends UserProfileType {}

export interface ProfileFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: 'name' | 'email' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface ProfileFormData {
  name?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface PasswordResetFormData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface GeneralSettingsFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// API Response Types
export interface ProfileResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    user: UserProfile;
  };
}

export interface ProfileUpdateResponse extends ApiResponseType {
  data: {
    user: UserProfile;
  };
}

export interface PasswordUpdateResponse extends ApiResponseType {}

// Payload Types
export interface ProfileUpdatePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface PasswordUpdatePayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// State Types
export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  isUpdatingPassword: boolean;
}