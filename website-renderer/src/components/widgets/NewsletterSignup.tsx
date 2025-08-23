'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  form_id?: number;
  placeholder?: string;
  button_text?: string;
  success_message?: string;
  background_color?: string;
  text_color?: string;
  layout?: 'horizontal' | 'vertical';
  websiteSubdomain?: string;
}

export function NewsletterSignup({
  title = 'Subscribe to our Newsletter',
  description = 'Get the latest updates and offers delivered directly to your inbox.',
  form_id,
  placeholder = 'Enter your email address',
  button_text = 'Subscribe',
  success_message = 'Thank you for subscribing!',
  background_color = '#1F2937',
  text_color = '#FFFFFF',
  layout = 'horizontal',
  websiteSubdomain
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!websiteSubdomain || !form_id) {
      setError('Newsletter signup is not configured');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.submitForm(websiteSubdomain, form_id, { email });
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: background_color,
    color: text_color
  };

  if (submitted) {
    return (
      <section className="py-12" style={containerStyle}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold mb-2">Successfully Subscribed!</h3>
          <p className="mb-4">{success_message}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Subscribe another email
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" style={containerStyle}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg opacity-90 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <form 
          onSubmit={handleSubmit} 
          className={`
            max-w-md mx-auto
            ${layout === 'horizontal' ? 'flex gap-2' : 'space-y-4'}
          `}
        >
          <div className={layout === 'horizontal' ? 'flex-1' : ''}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {submitting ? 'Subscribing...' : button_text}
          </button>
        </form>

        {error && (
          <div className="max-w-md mx-auto mt-4">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm opacity-75">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}