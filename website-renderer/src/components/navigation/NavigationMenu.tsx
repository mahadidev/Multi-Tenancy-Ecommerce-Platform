'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRoutes } from '@/lib/routes';
import { useAuth } from '@/contexts/AuthContext';
import { WebsiteMenu, MenuItem } from '@/types';

interface NavigationMenuProps {
  menu: WebsiteMenu;
  subdomain: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showDropdowns?: boolean;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  pages?: Array<{ slug: string; access_level?: string }>; // Optional pages data for enhanced filtering
}

export function NavigationMenu({ 
  menu, 
  subdomain, 
  className = '', 
  orientation = 'horizontal',
  showDropdowns = true,
  mobileBreakpoint = 'md',
  pages = []
}: NavigationMenuProps) {
  const { parseMenuItemUrl, isActive } = useRoutes(subdomain);
  const { isAuthenticated, isLoading } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter menu items based on authentication status and visibility
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      // First check explicit menu visibility setting
      const visibility = item.visibility || 'all';
      
      // Filter based on visibility settings
      if (visibility === 'logged_in' && !isAuthenticated) {
        // Hide logged-in only items from guests
        return false;
      }
      
      if (visibility === 'guest' && isAuthenticated) {
        // Hide guest-only items from authenticated users
        return false;
      }
      
      // For page-type menu items, also check the page's access level if available
      if (item.type === 'page' && item.page_slug && pages.length > 0) {
        const pageData = pages.find(p => p.slug === item.page_slug);
        if (pageData?.access_level) {
          const accessLevel = pageData.access_level;
          
          // Check page access level
          if (accessLevel === 'user' && !isAuthenticated) {
            // Hide user-only pages from guests
            return false;
          }
          
          if (accessLevel === 'guest' && isAuthenticated) {
            // Hide guest-only pages from authenticated users
            return false;
          }
        }
      }
      
      // Show all other items
      return true;
    }).map(item => ({
      ...item,
      children: item.children ? filterMenuItems(item.children) : undefined
    }));
  };

  // Don't filter during loading to avoid flashing incorrect menu items
  const filteredMenuItems = (menu.items && !isLoading) ? filterMenuItems(menu.items) : 
                            (menu.items || []);

  // All menus are considered active in this implementation

  const handleDropdownToggle = (itemId: number) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    // All menu items are considered active in this implementation

    const itemUrl = parseMenuItemUrl(item);
    const active = isActive(itemUrl);
    const hasChildren = item.children && item.children.length > 0;

    const linkClasses = `
      block px-3 py-2 text-sm font-medium transition-colors duration-200
      ${active 
        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }
      ${depth > 0 ? 'pl-6' : ''}
    `;

    const dropdownClasses = `
      absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50
      transform transition-all duration-200
      ${openDropdown === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
    `;

    if (hasChildren && showDropdowns) {
      return (
        <div key={item.id} className="relative">
          <button
            onClick={() => handleDropdownToggle(item.id)}
            className={`${linkClasses} flex items-center justify-between w-full`}
            aria-expanded={openDropdown === item.id}
          >
            <span>{item.title}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === item.id ? 'rotate-180' : ''
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={dropdownClasses}>
            {item.children?.map(child => (
              <Link
                key={child.id}
                href={parseMenuItemUrl(child)}
                target={child.target || '_self'}
                rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                onClick={() => setOpenDropdown(null)}
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={itemUrl}
        target={item.target || '_self'}
        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        className={linkClasses}
        onClick={() => {
          setOpenDropdown(null);
          setMobileOpen(false);
        }}
      >
        {item.title}
      </Link>
    );
  };

  const navigationClasses = `
    ${className}
    ${orientation === 'horizontal' 
      ? `flex items-center space-x-4 h-full` 
      : 'flex flex-col space-y-1'
    }
  `;

  const mobileMenuClasses = `
    ${mobileBreakpoint}:hidden
    ${mobileOpen ? 'block' : 'hidden'}
    absolute top-full left-0 right-0 bg-white shadow-lg border-t py-2 z-40
  `;

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav className={navigationClasses}>
        {filteredMenuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Mobile Menu Button */}
      {orientation === 'vertical' && (
        <button
          className={`${mobileBreakpoint}:hidden flex items-center px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        </button>
      )}

      {/* Mobile Navigation */}
      {orientation === 'vertical' && (
        <nav className={mobileMenuClasses}>
          {filteredMenuItems.map(item => (
            <div key={item.id} className="border-b last:border-b-0">
              {renderMenuItem(item)}
              {/* Mobile submenu items */}
              {item.children?.map(child => (
                <Link
                  key={child.id}
                  href={parseMenuItemUrl(child)}
                  target={child.target || '_self'}
                  rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="block pl-8 pr-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}

      {/* Backdrop for mobile menu */}
      {mobileOpen && orientation === 'vertical' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}

export default NavigationMenu;