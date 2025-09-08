'use client';

import React from 'react';
import Link from 'next/link';
import { useRoutes } from '@/lib/routes';

interface BreadcrumbProps {
  subdomain: string;
  menus: any[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
}

export function Breadcrumb({ 
  subdomain, 
  menus, 
  className = '',
  separator = <ChevronRightIcon />,
  showHome = true,
  maxItems = 5
}: BreadcrumbProps) {
  const { getBreadcrumbs } = useRoutes(subdomain);
  
  let breadcrumbs = getBreadcrumbs(menus);
  
  // Remove home if not wanted
  if (!showHome) {
    breadcrumbs = breadcrumbs.slice(1);
  }
  
  // Limit number of items
  if (breadcrumbs.length > maxItems) {
    breadcrumbs = [
      breadcrumbs[0], // Home
      { name: '...', url: '#' }, // Ellipsis
      ...breadcrumbs.slice(-(maxItems - 2)) // Last few items
    ];
  }

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isEllipsis = item.name === '...';
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">
                  {separator}
                </span>
              )}
              
              {isLast ? (
                <span 
                  className="text-sm font-medium text-gray-500"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : isEllipsis ? (
                <span className="text-sm text-gray-400">...</span>
              ) : (
                <Link
                  href={item.url}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ChevronRightIcon() {
  return (
    <svg 
      className="w-4 h-4 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 5l7 7-7 7" 
      />
    </svg>
  );
}

export default Breadcrumb;