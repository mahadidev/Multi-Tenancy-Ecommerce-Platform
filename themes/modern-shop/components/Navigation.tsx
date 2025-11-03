'use client';

import React, { useState, useEffect } from 'react';
import { useThemeHooks } from '../../_shared';
import { Button } from './Button';
import type { NavigationProps } from '../../_shared/lib/ThemeBase';

const Navigation: React.FC<NavigationProps> = ({
  logo = { text: 'ModernShop', href: '/' },
  menu = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
  showCart = true,
  showSearch = true
}) => {
  const { cart } = useThemeHooks();
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const count = await cart.getCartCount();
        setCartCount(count);
      } catch (error) {
        console.error('Failed to get cart count:', error);
        setCartCount(0);
      }
    };
    updateCartCount();
  }, [cart]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 modern-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={logo.href} className="flex items-center space-x-2">
            {logo.image ? (
              <img src={logo.image} alt={logo.text} className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-bold modern-text-gradient">
                {logo.text}
              </span>
            )}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menu.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {showSearch && (
              <Button variant="ghost" size="sm">
                <SearchIcon className="w-4 h-4" />
              </Button>
            )}

            {/* Cart */}
            {showCart && (
              <a href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <CartIcon className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </a>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-in">
            <div className="flex flex-col space-y-3">
              {menu.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 font-medium py-2 px-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Icons
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21" />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default Navigation;