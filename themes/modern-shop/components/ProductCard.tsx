'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import type { Product } from '../../_shared/types';

export interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  className?: string;
  // Optional action props - if not provided, buttons are hidden
  onAddToCart?: (product: Product, quantity?: number) => Promise<void>;
  onToggleWishlist?: (product: Product) => Promise<boolean>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showQuickAdd = true,
  showWishlist = true,
  className = '',
  onAddToCart,
  onToggleWishlist
}) => {
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onAddToCart) return;
    
    setLoading(true);
    try {
      await onAddToCart(product, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onToggleWishlist) return;
    
    try {
      const newState = await onToggleWishlist(product);
      setIsInWishlist(newState);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const primaryImage = product.images?.[0] || 'https://placehold.co/400x500/f5f5f5/999?text=No+Image';
  const secondaryImage = product.images?.[1];

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className={`group ${className}`}>
      <div className="card overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden">
          <a href={`/product/${product.slug}`}>
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                loading="lazy"
              />
            )}
          </a>

          {/* Badges */}
          <div className="absolute top-3 left-3">
            {hasDiscount && (
              <span className="badge bg-primary-500 text-white">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {showWishlist && onToggleWishlist && (
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50 ${
                isInWishlist ? 'text-red-500' : 'text-gray-600'
              }`}
              aria-label="Toggle wishlist"
            >
              <HeartIcon className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="card-body">
          <div className="mb-3">
            <a href={`/product/${product.slug}`} className="block">
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
            </a>
            {product.brand && (
              <p className="text-sm text-gray-500 mt-1">
                {typeof product.brand === 'string' ? product.brand : product.brand.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quick Add */}
          {showQuickAdd && onAddToCart && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              loading={loading}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Heart Icon
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
    />
  </svg>
);