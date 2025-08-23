'use client';

import React from 'react';

interface FeaturesListProps {
  title?: string;
  description?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
    color?: string;
  }>;
  layout?: 'grid' | 'list';
  columns?: number;
  icon_style?: 'rounded' | 'square' | 'circle';
  text_alignment?: 'left' | 'center' | 'right';
}

export function FeaturesList({
  title = 'Features',
  description,
  features = [
    {
      title: 'Fast Performance',
      description: 'Lightning fast loading times for better user experience.',
      icon: '⚡',
      color: '#3B82F6'
    },
    {
      title: 'Secure',
      description: 'Built with security best practices to protect your data.',
      icon: '🔒',
      color: '#10B981'
    },
    {
      title: 'Responsive',
      description: 'Works perfectly on all devices and screen sizes.',
      icon: '📱',
      color: '#8B5CF6'
    }
  ],
  layout = 'grid',
  columns = 3,
  icon_style = 'rounded',
  text_alignment = 'center'
}: FeaturesListProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const iconStyleClasses = {
    rounded: 'rounded-lg',
    square: 'rounded-none',
    circle: 'rounded-full'
  };

  const FeatureCard = ({ feature, index }: { feature: any; index: number }) => (
    <div key={index} className={`${alignmentClasses[text_alignment]} ${layout === 'list' ? 'flex items-start space-x-4' : ''}`}>
      {feature.icon && (
        <div className={`
          ${layout === 'list' ? 'flex-shrink-0' : 'mx-auto mb-4'}
          w-16 h-16 flex items-center justify-center text-2xl
          ${iconStyleClasses[icon_style]}
          ${layout === 'grid' && text_alignment === 'center' ? 'mx-auto' : ''}
          ${layout === 'grid' && text_alignment === 'right' ? 'ml-auto' : ''}
        `} style={{ 
          backgroundColor: feature.color || '#3B82F6',
          color: 'white'
        }}>
          {feature.icon}
        </div>
      )}
      
      <div className={layout === 'list' ? 'flex-1' : ''}>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </div>
  );

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className={
          layout === 'grid' 
            ? `grid ${gridCols[columns as keyof typeof gridCols]} gap-8`
            : 'space-y-8'
        }>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}