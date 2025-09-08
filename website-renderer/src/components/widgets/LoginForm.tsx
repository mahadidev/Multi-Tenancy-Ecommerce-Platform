'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { useRoutes } from '@/lib/routes';

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  show_social_login?: boolean;
  redirect_after_login?: string;
  show_signup_link?: boolean;
  signup_link_text?: string;
  signup_page_url?: string;
  websiteSubdomain?: string;
  show_forgot_password?: boolean;
  button_text?: string;
  button_color?: string;
  form_style?: 'card' | 'minimal' | 'bordered';
  alignment?: 'left' | 'center' | 'right';
}

export function LoginForm({
  title = 'Sign In',
  subtitle = 'Welcome back! Please sign in to your account.',
  show_social_login = false,
  redirect_after_login = '/',
  show_signup_link = true,
  signup_link_text = "Don't have an account? Sign up",
  signup_page_url = '/signup',
  websiteSubdomain,
  show_forgot_password = true,
  button_text = 'Sign In',
  button_color = '#3B82F6',
  form_style = 'card',
  alignment = 'left'
}: LoginFormProps) {
  const { login, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  // Always call useRoutes hook, but with fallback subdomain
  const routes = useRoutes(websiteSubdomain || 'default');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = websiteSubdomain ? routes.buildPageUrl('home') : redirect_after_login;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirect_after_login, router, websiteSubdomain, routes]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      showToast('Login successful! Welcome back.', 'success');
      // Use routes helper to build proper URL with subdomain
      const redirectUrl = websiteSubdomain ? routes.buildPageUrl('home') : redirect_after_login;
      router.push(redirectUrl);
    } else {
      showToast('Invalid email or password', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formClasses = {
    card: 'bg-white rounded-lg shadow-md p-6 max-w-md',
    minimal: 'max-w-md',
    bordered: 'border border-gray-200 rounded-lg p-6 max-w-md'
  };

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  };

  return (
    <div className={`w-full ${alignmentClasses[alignment]}`}>
      <div className={formClasses[form_style]}>
        {title && (
          <h2 className={`text-2xl font-bold mb-2 text-${alignment}`}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={`text-gray-600 mb-6 text-${alignment}`}>
            {subtitle}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            
            {show_forgot_password && (
              <Link
                href={websiteSubdomain ? routes.buildPageUrl('forgot-password') : '/forgot-password'}
                className="text-sm hover:underline"
                style={{ color: button_color }}
              >
                Forgot password?
              </Link>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: button_color }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              button_text
            )}
          </button>
        </form>

        {show_social_login && (
          <>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </>
        )}

        {show_signup_link && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <a
                href={websiteSubdomain ? routes.buildPageUrl('signup') : signup_page_url}
                className="font-medium hover:underline"
                style={{ color: button_color }}
              >
                {signup_link_text}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}