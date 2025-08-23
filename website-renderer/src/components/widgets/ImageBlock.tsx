'use client';

import React from 'react';
import Image from 'next/image';

interface ImageBlockProps {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  alignment?: 'left' | 'center' | 'right';
  border_radius?: string;
  shadow?: boolean;
  hover_effect?: 'none' | 'zoom' | 'fade' | 'lift';
  link_url?: string;
  open_in_new_tab?: boolean;
}

export function ImageBlock({
  src = '/placeholder-image.jpg',
  alt = 'Image',
  caption,
  width = 800,
  height = 600,
  alignment = 'center',
  border_radius = '0.5rem',
  shadow = false,
  hover_effect = 'none',
  link_url,
  open_in_new_tab = false
}: ImageBlockProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  const hoverEffectClasses = {
    none: '',
    zoom: 'hover:scale-105 transition-transform duration-300',
    fade: 'hover:opacity-80 transition-opacity duration-300',
    lift: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
  };

  const imageStyle: React.CSSProperties = {
    borderRadius: border_radius,
    boxShadow: shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : undefined,
  };

  const ImageComponent = (
    <div className={`relative overflow-hidden ${hoverEffectClasses[hover_effect]}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={imageStyle}
        className="w-full h-auto"
        priority={false}
      />
    </div>
  );

  const ContentWithCaption = (
    <figure className="inline-block">
      {ImageComponent}
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );

  return (
    <div className={`flex ${alignmentClasses[alignment]} w-full`}>
      {link_url ? (
        <a 
          href={link_url}
          target={open_in_new_tab ? '_blank' : '_self'}
          rel={open_in_new_tab ? 'noopener noreferrer' : undefined}
          className="inline-block"
        >
          {ContentWithCaption}
        </a>
      ) : (
        ContentWithCaption
      )}
    </div>
  );
}