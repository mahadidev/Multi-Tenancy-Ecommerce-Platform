'use client';

import React from 'react';

interface TextBlockProps {
  content?: string;
  heading?: string;
  heading_level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text_alignment?: 'left' | 'center' | 'right' | 'justify';
  text_color?: string;
  background_color?: string;
  padding?: string;
  max_width?: string;
  font_size?: 'small' | 'medium' | 'large' | 'xl';
  line_height?: 'tight' | 'normal' | 'relaxed' | 'loose';
}

export function TextBlock({
  content = '',
  heading,
  heading_level = 'h2',
  text_alignment = 'left',
  text_color = '#374151',
  background_color,
  padding = '1rem',
  max_width,
  font_size = 'medium',
  line_height = 'normal'
}: TextBlockProps) {
  const HeadingTag = heading_level;
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const lineHeightClasses = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  const headingSizeClasses = {
    h1: 'text-4xl lg:text-5xl font-bold',
    h2: 'text-3xl lg:text-4xl font-bold',
    h3: 'text-2xl lg:text-3xl font-semibold',
    h4: 'text-xl lg:text-2xl font-semibold',
    h5: 'text-lg lg:text-xl font-medium',
    h6: 'text-base lg:text-lg font-medium'
  };

  const containerStyle: React.CSSProperties = {
    color: text_color,
    backgroundColor: background_color,
    padding: padding,
    maxWidth: max_width || undefined,
  };

  // Parse content as HTML (basic support)
  const createMarkup = (html: string) => {
    return { __html: html };
  };

  return (
    <div 
      className={`${alignmentClasses[text_alignment]} ${fontSizeClasses[font_size]} ${lineHeightClasses[line_height]}`}
      style={containerStyle}
    >
      {heading && (
        <HeadingTag 
          className={`${headingSizeClasses[heading_level]} mb-4`}
          style={{ color: text_color }}
        >
          {heading}
        </HeadingTag>
      )}
      
      {content && (
        <div 
          className="prose prose-lg max-w-none"
          style={{ color: text_color }}
          dangerouslySetInnerHTML={createMarkup(content)}
        />
      )}
    </div>
  );
}