// Base Auth Actions Interface
import { User, AuthResponse } from '../../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  getCurrentUser: () => User | null;
  isAuthenticated: () => boolean;
  forgotPassword?: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword?: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
}