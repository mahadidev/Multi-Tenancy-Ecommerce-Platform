'use client';

import React, { useState } from 'react';
import { Button } from '../components/Button';
import { isValidEmail } from '../../_shared/utils';
import toast from 'react-hot-toast';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
  title = 'Stay in the Loop',
  description = 'Get the latest updates on new products, exclusive offers, and more.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Thanks for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`section bg-gradient-to-br from-primary-600 to-secondary-600 text-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              {title}
            </h2>
            <p className="text-lg text-white/90 text-pretty">
              {description}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="form-input w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              loading={loading}
              className="bg-white text-primary-600 hover:bg-white/90"
            >
              {buttonText}
            </Button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-white/70 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;