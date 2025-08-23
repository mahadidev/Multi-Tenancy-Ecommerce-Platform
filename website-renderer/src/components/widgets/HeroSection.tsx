'use client';

import React from 'react';
import { ButtonBlock } from './ButtonBlock';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  background_image?: string;
  background_video?: string;
  overlay_opacity?: number;
  text_color?: string;
  background_color?: string;
  alignment?: 'left' | 'center' | 'right';
  height?: 'small' | 'medium' | 'large' | 'fullscreen';
  buttons?: Array<{
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
  }>;
  websiteSubdomain?: string;
}

export function HeroSection({
  title = 'Welcome to Our Website',
  subtitle,
  description,
  background_image,
  background_video,
  overlay_opacity = 0.5,
  text_color = 'white',
  background_color = '#1f2937',
  alignment = 'center',
  height = 'large',
  buttons = [],
}: HeroSectionProps) {
  const heightClasses = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-screen',
    fullscreen: 'min-h-screen'
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundColor: background_color,
    backgroundImage: background_image ? `url(${background_image})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section 
      className={`relative ${heightClasses[height]} flex flex-col justify-center ${alignmentClasses[alignment]} px-4 sm:px-6 lg:px-8`}
      style={backgroundStyle}
    >
      {/* Background Video */}
      {background_video && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={background_video} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {(background_image || background_video) && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlay_opacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {subtitle && (
          <p 
            className="text-lg sm:text-xl font-medium mb-4"
            style={{ color: text_color }}
          >
            {subtitle}
          </p>
        )}
        
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          style={{ color: text_color }}
        >
          {title}
        </h1>
        
        {description && (
          <p 
            className="text-lg sm:text-xl mb-8 max-w-3xl"
            style={{ color: text_color }}
          >
            {description}
          </p>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <ButtonBlock
                key={index}
                text={button.text}
                url={button.url}
                style={button.style}
                size="large"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}