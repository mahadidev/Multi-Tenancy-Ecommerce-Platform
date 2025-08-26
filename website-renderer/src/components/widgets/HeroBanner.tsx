'use client';

import React from 'react';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  height?: 'small' | 'medium' | 'large' | 'full';
}

export function HeroBanner({
  title = 'Welcome to Our Store',
  subtitle = 'Discover amazing products',
  backgroundImage = '/api/placeholder/1920/600',
  buttonText = 'Shop Now',
  buttonLink = '/products',
  overlay = true,
  overlayOpacity = 0.5,
  textAlign = 'center',
  height = 'large'
}: HeroBannerProps) {
  const heightClasses = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-[500px]',
    full: 'h-screen'
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <section 
      className={`relative ${heightClasses[height]} flex flex-col justify-center px-4 sm:px-6 lg:px-8 ${alignmentClasses[textAlign]}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className={`max-w-3xl ${textAlign === 'center' ? 'mx-auto' : textAlign === 'right' ? 'ml-auto' : ''}`}>
          {subtitle && (
            <p className="text-lg sm:text-xl font-medium mb-4 text-white opacity-90">
              {subtitle}
            </p>
          )}
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {title}
          </h1>
          
          {buttonText && (
            <a 
              href={buttonLink}
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}