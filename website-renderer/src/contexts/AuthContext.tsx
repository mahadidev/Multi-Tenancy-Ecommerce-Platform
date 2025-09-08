'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hooks } from '@/lib/hooks';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  store_specific?: {
    loyalty_points?: number;
    total_spent?: number;
    orders_count?: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  subdomain: string;
}

export function AuthProvider({ children, subdomain }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== 'undefined') {
        const authKey = `auth_${subdomain}`;
        const tokenKey = `token_${subdomain}`;
        
        const savedAuth = localStorage.getItem(authKey);
        const savedToken = localStorage.getItem(tokenKey);
        
        if (savedAuth && savedToken) {
          try {
            const userData = JSON.parse(savedAuth);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Loaded user from localStorage:', userData);
          } catch (error) {
            console.error('Failed to parse saved auth:', error);
            localStorage.removeItem(authKey);
            localStorage.removeItem(tokenKey);
          }
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [subdomain]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authKey = `auth_${subdomain}`;
      
      if (user) {
        localStorage.setItem(authKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(authKey);
      }
    }
  }, [user, subdomain]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const executor = hooks.init(subdomain);
      const result = await executor.userLogin({ email, password });

      if (result.success && result.data) {
        const { user: userData, token } = result.data;
        
        // Save token to localStorage
        if (token && typeof window !== 'undefined') {
          localStorage.setItem(`token_${subdomain}`, token);
        }

        setUser({
          ...userData,
          id: parseInt(userData.id as any)
        });
        setIsAuthenticated(true);
        
        console.log('✅ Login successful:', userData);
        return true;
      }
      
      throw new Error(result.message || 'Login failed');
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // For development: Mock login if backend is unavailable
      if (error instanceof Error && error.message.includes('fetch failed')) {
        console.warn('🚧 Backend not available, using mock login');
        
        const mockUser: User = {
          id: 1,
          name: 'Test User',
          email: email,
          store_specific: {
            loyalty_points: 100,
            total_spent: 500,
            orders_count: 5
          }
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem(`token_${subdomain}`, 'mock-token-' + Date.now());
        
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const executor = hooks.init(subdomain);
      const result = await executor.userSignup({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone
      });

      if (result.success && result.data) {
        const { user: userData, token } = result.data;
        
        // Save token to localStorage
        if (token && typeof window !== 'undefined') {
          localStorage.setItem(`token_${subdomain}`, token);
        }

        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('✅ Signup successful:', userData);
        return true;
      }
      
      throw new Error(result.message || 'Signup failed');
    } catch (error) {
      console.error('❌ Signup error:', error);
      
      // For development: Mock signup if backend is unavailable
      if (error instanceof Error && error.message.includes('fetch failed')) {
        console.warn('🚧 Backend not available, using mock signup');
        
        const mockUser: User = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          store_specific: {
            loyalty_points: 0,
            total_spent: 0,
            orders_count: 0
          }
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem(`token_${subdomain}`, 'mock-token-' + Date.now());
        
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const executor = hooks.init(subdomain);
      await executor.userLogout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Clear local state regardless of API result
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`auth_${subdomain}`);
        localStorage.removeItem(`token_${subdomain}`);
        // Note: We don't clear the cart here anymore
        // The cart will be handled by CartContext which may want to preserve guest cart
      }
      
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // TODO: Implement profile update API call
      // For now, just update local state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      console.log('✅ Profile updated:', updatedUser);
      return true;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}