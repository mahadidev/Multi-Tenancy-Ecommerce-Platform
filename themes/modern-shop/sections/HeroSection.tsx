import React from 'react';
import { Button } from '../components/Button';
import type { HeroSectionProps } from '../../_shared/types';

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Discover Amazing Products',
  subtitle = 'New Collection 2024',
  description = 'Find the perfect products for your lifestyle. Quality meets style in our curated collection.',
  primaryButton = { text: 'Shop Now', href: '/shop' },
  secondaryButton = { text: 'Learn More', href: '/about' },
  backgroundImage,
  textAlign = 'left',
  className = ''
}) => {
  return (
    <section className={`section bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 -right-16 w-96 h-96 modern-gradient rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-16 w-80 h-80 bg-secondary-400 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl ${textAlign === 'center' ? 'mx-auto text-center' : textAlign === 'right' ? 'ml-auto text-right' : ''}`}>
          {/* Subtitle */}
          {subtitle && (
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-primary-200 mb-6">
              <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
                {subtitle}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
            <span className="modern-text-gradient">{title}</span>
          </h1>
          
          {/* Description */}
          {description && (
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl text-pretty">
              {description}
            </p>
          )}

          {/* Actions */}
          <div className={`flex flex-col sm:flex-row gap-4 ${
            textAlign === 'center' ? 'justify-center' :
            textAlign === 'right' ? 'justify-end' :
            'justify-start'
          }`}>
            {primaryButton && (
              <a href={primaryButton.href}>
                <Button variant="primary" size="lg" className="modern-shadow-lg">
                  {primaryButton.text}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </a>
            )}
            {secondaryButton && (
              <a href={secondaryButton.href}>
                <Button variant="outline" size="lg">
                  {secondaryButton.text}
                </Button>
              </a>
            )}
          </div>

          {/* Stats or Features */}
          <div className="mt-12 pt-8 border-t border-white/50">
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-secondary-600">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Image */}
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/80" />
          </div>
        )}
      </div>
    </section>
  );
};

// Arrow Right Icon
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default HeroSection;