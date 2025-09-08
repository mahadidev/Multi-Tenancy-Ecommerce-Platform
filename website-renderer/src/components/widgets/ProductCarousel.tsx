'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';

interface ProductCarouselProps {
  title?: string;
  itemsToShow?: number;
  autoplay?: boolean;
  showArrows?: boolean;
  filter?: 'all' | 'featured' | 'new' | 'sale';
  websiteSubdomain: string;
}

export function ProductCarousel({
  title = 'Featured Products',
  itemsToShow = 4,
  autoplay = false,
  showArrows = true,
  filter = 'all',
  websiteSubdomain
}: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await apiClient.getProducts(websiteSubdomain, { filter, limit: 12 });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [websiteSubdomain, filter]);

  const scrollLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => Math.min(products.length - itemsToShow, prev + 1));
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-2xl font-bold mb-8">{title}</h2>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(itemsToShow)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-2xl font-bold mb-8">{title}</h2>}
        
        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            {visibleProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="group cursor-pointer">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={product.thumbnail || '/api/placeholder/400/400'}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {showArrows && products.length > itemsToShow && (
            <>
              <button
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                disabled={currentIndex >= products.length - itemsToShow}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}