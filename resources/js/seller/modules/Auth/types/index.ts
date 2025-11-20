/* eslint-disable @typescript-eslint/no-empty-object-type */
import { UserProfileType, UserType } from '@type/authType';
import { StoreType } from '@type/storeType';
// import { ApiResponseType } from '@type/apiType';

// Core Types
export interface User extends UserType {}

export interface UserProfile extends UserProfileType {}

export interface AuthFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sort_by?: 'name' | 'email' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface AuthFormData {
  name?: string;
  email: string;
  password?: string;
  confirm_password?: string;
  phone?: string;
  address?: string;
}

// API Response Types
export interface LoginResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    user: User;
    access_token: string;
    logged_store: StoreType;
    stores: StoreType[];
  };
}

export interface RegisterResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    user: User;
    access_token: string;
  };
}

export interface UserResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    user: UserProfile;
  };
}

export interface EmailVerificationResponse {
  success: boolean;
  status: number;
  message?: string;
  data?: any;
}

export interface SocialAuthResponse {
  success: boolean;
  status: number;
  message?: string;
  data: {
    auth_url: string;
  };
}

// Payload Types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface EmailVerificationPayload {
  token: string;
  user_id: string;
}

export interface VerifySocialMediaAuthenticationPayload {
  token: string;
  user_id: string;
  store_id?: string;
}

export interface PasswordForgotRequestPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface UserUpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// State Types
export interface AuthState {
  user: User | null;
  userProfileData: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
