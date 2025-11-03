import toast from 'react-hot-toast';
import { User, AuthResponse } from '../../types';
import { AuthActions, LoginCredentials, RegisterData } from './AuthActions';

/**
 * Demo implementation of AuthActions for theme development
 * This is used when developing/previewing themes
 * In production, the website-renderer will provide real implementation
 */
export class AuthActionsImpl implements AuthActions {
  private user: User | null = null;
  private storageKey: string;

  constructor(storageKey: string = 'demo_auth') {
    this.storageKey = storageKey;
    
    // Load from localStorage for demo mode
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(this.storageKey);
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch {
          this.user = null;
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      if (this.user) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Demo mode - simulate login
    this.user = {
      id: 'demo-' + Date.now(),
      name: 'Demo User',
      email: credentials.email,
      avatar: `https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff`
    };
    
    this.saveToStorage();
    
    toast.success(
      (
        <div>
          <strong>Welcome back!</strong>
          <br />
          <span className="text-sm opacity-75">Logged in as {credentials.email}</span>
        </div>
      ),
      { duration: 3000 }
    );

    return {
      success: true,
      user: this.user,
      message: 'Login successful'
    };
  }

  async logout(): Promise<void> {
    this.user = null;
    this.saveToStorage();
    
    toast.success('Logout successful', { duration: 2000 });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Demo mode - simulate registration
    this.user = {
      id: `demo-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0D8ABC&color=fff`
    };
    
    this.saveToStorage();
    
    toast.success(
      (
        <div>
          <strong>Welcome, {data.name}!</strong>
          <br />
          <span className="text-sm opacity-75">Account created successfully</span>
        </div>
      ),
      { duration: 3000 }
    );

    return {
      success: true,
      user: this.user,
      message: 'Registration successful'
    };
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    toast.success(
      (
        <div>
          <strong>Password reset email sent!</strong>
          <br />
          <span className="text-sm opacity-75">Check {email}</span>
        </div>
      ),
      { duration: 4000 }
    );

    return {
      success: true,
      message: `Password reset instructions sent to ${email}`
    };
  }

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    toast.success('Password reset successfully!', { duration: 3000 });
    
    return {
      success: true,
      message: 'Password has been reset successfully'
    };
  }
}