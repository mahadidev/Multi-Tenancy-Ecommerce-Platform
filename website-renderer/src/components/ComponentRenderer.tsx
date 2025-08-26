'use client';

import React from 'react';
import { PageComponent } from '@/types';
import { HeroSection } from './widgets/HeroSection';
import { HeroBanner } from './widgets/HeroBanner';
import { HeroSlider } from './widgets/HeroSlider';
import { TextBlock } from './widgets/TextBlock';
import { ImageBlock } from './widgets/ImageBlock';
import { ProductGrid } from './widgets/ProductGrid';
import { ProductCarousel } from './widgets/ProductCarousel';
import { ContactForm } from './widgets/ContactForm';
import { ButtonBlock } from './widgets/ButtonBlock';
import { VideoBlock } from './widgets/VideoBlock';
import { TestimonialBlock } from './widgets/TestimonialBlock';
import { FeaturesList } from './widgets/FeaturesList';
import { FeatureCards } from './widgets/FeatureCards';
import { NewsletterSignup } from './widgets/NewsletterSignup';

interface ComponentRendererProps {
  component: PageComponent;
  websiteSubdomain: string;
}

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // Hero components
  'hero-section': HeroSection,
  'hero-banner': HeroBanner,
  'hero-slider': HeroSlider,
  
  // Product components
  'product-grid': ProductGrid,
  'product-carousel': ProductCarousel,
  
  // Content components
  'text-block': TextBlock,
  'image-block': ImageBlock,
  'feature-cards': FeatureCards,
  'features-list': FeaturesList,
  
  // Interactive components
  'contact-form': ContactForm,
  'button-block': ButtonBlock,
  'video-block': VideoBlock,
  'testimonial-block': TestimonialBlock,
  'newsletter-signup': NewsletterSignup,
  
  // Navigation components (TODO: implement these)
  'navigation-bar': TextBlock, // Placeholder
  'modern-footer': TextBlock, // Placeholder
  'image-gallery': TextBlock, // Placeholder
  'testimonials': TestimonialBlock, // Use existing testimonial block
};

export function ComponentRenderer({ component, websiteSubdomain }: ComponentRendererProps) {
  // Treat undefined as visible (default to true if not explicitly set to false)
  const isVisible = component.is_visible !== false;
  
  if (!isVisible) {
    return null;
  }

  // Fix: If component_type is missing but we can infer it from props, reconstruct it
  if (!component.component_type) {
    
    // Try to infer component type from props and render accordingly
    if (component.props?.title && component.props?.subtitle) {
      // This looks like a hero section, render it directly
      return (
        <section className="relative h-screen flex flex-col justify-center text-center items-center px-4 sm:px-6 lg:px-8" 
                 style={{
                   backgroundColor: component.props.background_color || '#1f2937',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}>
          <div className="relative z-10 max-w-7xl mx-auto">
            {component.props.subtitle && (
              <p className="text-lg sm:text-xl font-medium mb-4" style={{color: 'white'}}>
                {component.props.subtitle}
              </p>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{color: 'white'}}>
              {component.props.title}
            </h1>
            {component.props.description && (
              <p className="text-lg sm:text-xl mb-8 max-w-3xl" style={{color: 'white'}}>
                {component.props.description}
              </p>
            )}
          </div>
        </section>
      );
    }
    
    // Generic fallback for other components
    return (
      <div className="border border-blue-300 bg-blue-50 p-4 rounded">
        <h3 className="text-blue-700 font-semibold">Missing Component Type (ID: {component.id})</h3>
        <p className="text-sm text-blue-600">Component Name: {component.name || 'Unknown'}</p>
        <details className="mt-4">
          <summary className="text-sm cursor-pointer">Raw Component Data</summary>
          <pre className="text-xs bg-white p-2 mt-2 overflow-auto rounded">
            {JSON.stringify(component, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (!component.component_type.slug) {
    return (
      <div className="border border-red-300 bg-red-50 p-4 rounded">
        <p className="text-red-700">Component type is missing slug</p>
        <p className="text-sm text-red-600">Component Type: {component.component_type.name || 'Unknown'}</p>
      </div>
    );
  }

  const ComponentToRender = COMPONENT_MAP[component.component_type.slug];

  if (!ComponentToRender) {
    return (
      <div className="border border-red-300 bg-red-50 p-4 rounded">
        <p className="text-red-700">Unknown component: {component.component_type.name}</p>
        <p className="text-sm text-red-600">Component type slug: {component.component_type.slug}</p>
      </div>
    );
  }

  const containerClasses = getResponsiveClasses(component.responsive_settings);
  const animationClasses = getAnimationClasses(component.animation_settings);

  return (
    <div 
      className={`${containerClasses} ${animationClasses}`}
      style={component.styles}
    >
      <ComponentToRender 
        {...component.props}
        websiteSubdomain={websiteSubdomain}
        componentId={component.id}
      />
    </div>
  );
}

function getResponsiveClasses(responsiveSettings?: Record<string, any>): string {
  if (!responsiveSettings) return '';

  const classes: string[] = [];

  if (responsiveSettings.hidden_mobile) {
    classes.push('hidden md:block');
  }
  if (responsiveSettings.hidden_tablet) {
    classes.push('md:hidden lg:block');
  }
  if (responsiveSettings.hidden_desktop) {
    classes.push('lg:hidden');
  }

  return classes.join(' ');
}

function getAnimationClasses(animationSettings?: Record<string, any>): string {
  if (!animationSettings) return '';

  const classes: string[] = [];

  if (animationSettings.fade_in) {
    classes.push('animate-fadeIn');
  }
  if (animationSettings.slide_up) {
    classes.push('animate-slideUp');
  }
  if (animationSettings.bounce) {
    classes.push('animate-bounce');
  }

  return classes.join(' ');
}