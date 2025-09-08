'use client';

import React from 'react';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

interface BreadcrumbWidgetProps {
  show_home?: boolean;
  separator_type?: 'chevron' | 'slash' | 'arrow' | 'dot';
  max_items?: number;
  alignment?: 'left' | 'center' | 'right';
  background_color?: string;
  text_color?: string;
  hover_color?: string;
  font_size?: string;
  padding?: string;
  margin?: string;
  websiteSubdomain?: string;
  websiteMenus?: any[];
  custom_separator?: string;
}

export function BreadcrumbWidget({
  show_home = true,
  separator_type = 'chevron',
  max_items = 5,
  alignment = 'left',
  background_color = 'transparent',
  text_color = '#374151',
  hover_color = '#2563EB',
  font_size = '14px',
  padding = '12px 0',
  margin = '0',
  custom_separator,
  websiteSubdomain,
  websiteMenus = []
}: BreadcrumbWidgetProps) {
  
  if (!websiteSubdomain) return null;

  const getSeparator = () => {
    if (custom_separator) {
      return <span>{custom_separator}</span>;
    }

    switch (separator_type) {
      case 'slash':
        return <span className="text-gray-400">/</span>;
      case 'arrow':
        return <span className="text-gray-400">→</span>;
      case 'dot':
        return <span className="text-gray-400">•</span>;
      case 'chevron':
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const containerStyle = {
    backgroundColor: background_color,
    color: text_color,
    fontSize: font_size,
    padding,
    margin
  };

  return (
    <div 
      className={`breadcrumb-widget ${alignmentClasses[alignment]}`}
      style={containerStyle}
    >
      <style jsx>{`
        .breadcrumb-widget a:hover {
          color: ${hover_color} !important;
        }
        .breadcrumb-widget .navigation-menu {
          display: inline-flex;
        }
      `}</style>
      
      <Breadcrumb
        subdomain={websiteSubdomain}
        menus={websiteMenus}
        separator={getSeparator()}
        showHome={show_home}
        maxItems={max_items}
        className="inline-flex"
      />
    </div>
  );
}

export default BreadcrumbWidget;