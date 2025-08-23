'use client';

import React from 'react';
import Image from 'next/image';

interface TestimonialBlockProps {
  testimonials?: Array<{
    name: string;
    role?: string;
    company?: string;
    content: string;
    avatar?: string;
    rating?: number;
  }>;
  layout?: 'single' | 'grid' | 'carousel';
  columns?: number;
  show_rating?: boolean;
  background_color?: string;
  text_color?: string;
}

export function TestimonialBlock({
  testimonials = [
    {
      name: 'John Doe',
      role: 'CEO',
      company: 'Example Corp',
      content: 'This is an amazing service that has transformed our business.',
      rating: 5
    }
  ],
  layout = 'grid',
  columns = 2,
  show_rating = true,
  background_color,
  text_color = '#374151'
}: TestimonialBlockProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: background_color,
    color: text_color
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => (
    <div key={index} className="bg-white rounded-lg shadow-md p-6 border">
      {show_rating && testimonial.rating && (
        <div className="flex mb-4">
          {renderStars(testimonial.rating)}
        </div>
      )}
      
      <blockquote className="text-gray-700 mb-4 italic">
        "{testimonial.content}"
      </blockquote>
      
      <div className="flex items-center">
        {testimonial.avatar && (
          <div className="relative w-12 h-12 mr-4">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          {(testimonial.role || testimonial.company) && (
            <div className="text-sm text-gray-600">
              {testimonial.role}
              {testimonial.role && testimonial.company && ', '}
              {testimonial.company}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (layout === 'single' && testimonials.length > 0) {
    const testimonial = testimonials[0];
    return (
      <section className="py-8" style={containerStyle}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          {show_rating && testimonial.rating && (
            <div className="flex justify-center mb-6">
              {renderStars(testimonial.rating)}
            </div>
          )}
          
          <blockquote className="text-xl md:text-2xl font-medium mb-8 italic">
            "{testimonial.content}"
          </blockquote>
          
          <div className="flex items-center justify-center">
            {testimonial.avatar && (
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-lg">{testimonial.name}</div>
              {(testimonial.role || testimonial.company) && (
                <div className="text-gray-600">
                  {testimonial.role}
                  {testimonial.role && testimonial.company && ', '}
                  {testimonial.company}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8" style={containerStyle}>
      <div className="container mx-auto px-4">
        <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}