'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useRoutes } from '@/lib/routes';

interface ProfileFormProps {
  title?: string;
  subtitle?: string;
  show_email?: boolean;
  show_phone?: boolean;
  show_address?: boolean;
  show_loyalty_info?: boolean;
  form_style?: 'card' | 'simple';
  alignment?: 'left' | 'center' | 'right';
  button_text?: string;
  success_message?: string;
  websiteSubdomain?: string;
}

export function ProfileForm({
  title = 'My Profile',
  subtitle = 'Manage your account information',
  show_email = true,
  show_phone = true,
  show_address = false,
  show_loyalty_info = true,
  form_style = 'card',
  alignment = 'center',
  button_text = 'Update Profile',
  success_message = 'Profile updated successfully!',
  websiteSubdomain
}: ProfileFormProps) {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const router = useRouter();
  const routes = websiteSubdomain ? useRoutes(websiteSubdomain) : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const loginUrl = websiteSubdomain && routes 
        ? routes.buildPageUrl('login') + `&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
        : '/login';
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, router, websiteSubdomain, routes]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '' // TODO: Add address field to user data
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('An error occurred while updating your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className={`flex justify-${alignment} py-8`}>
        <div className={`w-full max-w-md ${form_style === 'card' ? 'bg-white p-8 rounded-lg shadow-md border' : 'p-6'}`}>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`flex justify-${alignment} py-8`}>
      <div className={`w-full max-w-md ${form_style === 'card' ? 'bg-white p-8 rounded-lg shadow-md border' : 'p-6'}`}>
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Loyalty Info */}
        {show_loyalty_info && user.store_specific && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Account Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-700">{user.store_specific.orders_count || 0}</div>
                <div className="text-blue-600">Orders</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700">${user.store_specific.total_spent || 0}</div>
                <div className="text-blue-600">Spent</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700">{user.store_specific.loyalty_points || 0}</div>
                <div className="text-blue-600">Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {success_message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email Field */}
          {show_email && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled // Email usually shouldn't be editable
              />
              <p className="text-xs text-gray-500 mt-1">
                Contact support to change your email address
              </p>
            </div>
          )}

          {/* Phone Field */}
          {show_phone && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Address Field */}
          {show_address && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your address..."
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </div>
            ) : (
              button_text
            )}
          </button>
        </form>

        {/* Additional Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                if (routes) {
                  router.push(routes.buildPageUrl('home'));
                } else {
                  router.push('/');
                }
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Home
            </button>
            <button
              type="button"
              onClick={async () => {
                if (confirm('Are you sure you want to log out?')) {
                  await logout();
                  // Redirect to home page after logout
                  if (routes) {
                    router.push(routes.buildPageUrl('home'));
                  } else {
                    router.push('/');
                  }
                }
              }}
              className="text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;