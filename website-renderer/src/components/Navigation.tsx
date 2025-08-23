'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Website, WebsiteMenu, MenuItem } from '@/types';

interface NavigationProps {
  website: Website;
}

export function Navigation({ website }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const headerMenus = website.menus.filter(menu => menu.location === 'header');
  const primaryMenu = headerMenus[0]; // Use the first header menu as primary

  if (!primaryMenu) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b" style={primaryMenu.styles}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {website.store.logo && (
                <div className="relative w-8 h-8">
                  <Image
                    src={website.store.logo}
                    alt={website.store.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-xl font-semibold text-gray-900">
                {website.store.name}
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {primaryMenu.items.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {primaryMenu.items.map((item) => (
                <MobileNavItem key={item.id} item={item} onClick={() => setMobileMenuOpen(false)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavItemProps {
  item: MenuItem;
}

function NavItem({ item }: NavItemProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const linkProps = {
    href: item.url,
    target: item.target || '_self',
    rel: item.target === '_blank' ? 'noopener noreferrer' : undefined,
  };

  if (hasChildren) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center">
          {item.title}
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {dropdownOpen && (
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50">
            <div className="py-1">
              {item.children!.map((child) => (
                <Link
                  key={child.id}
                  href={child.url}
                  target={child.target || '_self'}
                  rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      {...linkProps}
      className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
    >
      {item.title}
    </Link>
  );
}

interface MobileNavItemProps {
  item: MenuItem;
  onClick: () => void;
}

function MobileNavItem({ item, onClick }: MobileNavItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium flex items-center justify-between"
        >
          {item.title}
          <svg 
            className={`h-4 w-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expanded && (
          <div className="pl-4">
            {item.children!.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                target={child.target || '_self'}
                rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                onClick={onClick}
                className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-sm"
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      target={item.target || '_self'}
      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
    >
      {item.title}
    </Link>
  );
}