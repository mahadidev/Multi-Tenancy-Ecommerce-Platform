'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonBlockProps {
  text?: string;
  url?: string;
  style?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  background_color?: string;
  border_color?: string;
  hover_color?: string;
  hover_background_color?: string;
  border_radius?: string;
  open_in_new_tab?: boolean;
  full_width?: boolean;
  icon?: string;
  icon_position?: 'left' | 'right';
}

export function ButtonBlock({
  text = 'Click Here',
  url = '#',
  style = 'primary',
  size = 'medium',
  color,
  background_color,
  border_color,
  hover_color,
  hover_background_color,
  border_radius = '0.375rem',
  open_in_new_tab = false,
  full_width = false,
  icon,
  icon_position = 'left'
}: ButtonBlockProps) {
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const styleClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600',
    outline: 'bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-600',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-transparent'
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${styleClasses[style]}
    ${full_width ? 'w-full' : ''}
  `;

  const buttonStyle: React.CSSProperties = {
    borderRadius: border_radius,
    color: color,
    backgroundColor: background_color,
    borderColor: border_color,
  };

  const hoverStyle: React.CSSProperties = {
    '--hover-color': hover_color,
    '--hover-bg': hover_background_color,
  } as React.CSSProperties;

  const ButtonContent = (
    <>
      {icon && icon_position === 'left' && (
        <span className="mr-2">
          <i className={icon} />
        </span>
      )}
      {text}
      {icon && icon_position === 'right' && (
        <span className="ml-2">
          <i className={icon} />
        </span>
      )}
    </>
  );

  const isExternalUrl = url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:');
  const shouldOpenInNewTab = open_in_new_tab || isExternalUrl;

  if (isExternalUrl) {
    return (
      <a
        href={url}
        target={shouldOpenInNewTab ? '_blank' : '_self'}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        style={{ ...buttonStyle, ...hoverStyle }}
      >
        {ButtonContent}
      </a>
    );
  }

  return (
    <Link
      href={url}
      target={shouldOpenInNewTab ? '_blank' : '_self'}
      className={baseClasses}
      style={{ ...buttonStyle, ...hoverStyle }}
    >
      {ButtonContent}
    </Link>
  );
}