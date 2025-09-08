'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { useRoutes } from '@/lib/routes';

interface SignupFormProps {
  title?: string;
  subtitle?: string;
  show_social_signup?: boolean;
  redirect_after_signup?: string;
  show_login_link?: boolean;
  login_link_text?: string;
  login_page_url?: string;
  require_phone?: boolean;
  show_terms?: boolean;
  terms_text?: string;
  terms_url?: string;
  privacy_url?: string;
  button_text?: string;
  button_color?: string;
  form_style?: 'card' | 'minimal' | 'bordered';
  alignment?: 'left' | 'center' | 'right';
  show_name_fields?: 'full' | 'first_last' | 'single';
  websiteSubdomain?: string;
}

export function SignupForm({
  title = 'Create Account',
  subtitle = 'Join us today and get started!',
  show_social_signup = false,
  redirect_after_signup = '/',
  show_login_link = true,
  login_link_text = 'Already have an account? Sign in',
  login_page_url = '/login',
  require_phone = false,
  show_terms = true,
  terms_text = 'I agree to the Terms of Service and Privacy Policy',
  terms_url = '/terms',
  privacy_url = '/privacy',
  button_text = 'Sign Up',
  button_color = '#3B82F6',
  form_style = 'card',
  alignment = 'left',
  show_name_fields = 'full',
  websiteSubdomain
}: SignupFormProps) {
  const { signup, isLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  // Always call useRoutes hook, but with fallback subdomain
  const routes = useRoutes(websiteSubdomain || 'default');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    terms_accepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = websiteSubdomain ? routes.buildPageUrl('home') : redirect_after_signup;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirect_after_signup, router, websiteSubdomain, routes]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (show_name_fields === 'first_last') {
      if (!formData.first_name) {
        newErrors.first_name = 'First name is required';
      }
      if (!formData.last_name) {
        newErrors.last_name = 'Last name is required';
      }
    } else {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (require_phone && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    if (show_terms && !formData.terms_accepted) {
      newErrors.terms_accepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const fullName = show_name_fields === 'first_last' 
      ? `${formData.first_name} ${formData.last_name}`
      : formData.name;
    
    const success = await signup({
      name: fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      password: formData.password,
      password_confirmation: formData.password_confirmation
    });
    
    if (success) {
      showToast('Account created successfully! Welcome aboard.', 'success');
      const redirectUrl = websiteSubdomain ? routes.buildPageUrl('home') : redirect_after_signup;
      router.push(redirectUrl);
    } else {
      showToast('Failed to create account. Email may already be in use.', 'error');
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
          {show_name_fields === 'first_last' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="First name"
                  disabled={isLoading}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Last name"
                  disabled={isLoading}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>
          ) : show_name_fields === 'full' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

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

          {(require_phone || formData.phone) && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number {!require_phone && '(Optional)'}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          )}

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
              placeholder="Create a password"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
            )}
          </div>

          {show_terms && (
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-0.5"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {terms_url || privacy_url ? (
                    <>
                      I agree to the{' '}
                      {terms_url && (
                        <a
                          href={terms_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          style={{ color: button_color }}
                        >
                          Terms of Service
                        </a>
                      )}
                      {terms_url && privacy_url && ' and '}
                      {privacy_url && (
                        <a
                          href={privacy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          style={{ color: button_color }}
                        >
                          Privacy Policy
                        </a>
                      )}
                    </>
                  ) : (
                    terms_text
                  )}
                </span>
              </label>
              {errors.terms_accepted && (
                <p className="mt-1 text-sm text-red-600">{errors.terms_accepted}</p>
              )}
            </div>
          )}

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
                Creating account...
              </div>
            ) : (
              button_text
            )}
          </button>
        </form>

        {show_social_signup && (
          <>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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

        {show_login_link && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <a
                href={websiteSubdomain ? routes.buildPageUrl('login') : login_page_url}
                className="font-medium hover:underline"
                style={{ color: button_color }}
              >
                {login_link_text}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}