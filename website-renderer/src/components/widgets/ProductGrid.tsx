'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';

interface ProductGridProps {
  title?: string;
  description?: string;
  columns?: number;
  max_products?: number;
  filter?: 'all' | 'featured' | 'latest' | 'bestselling';
  category_id?: number;
  brand_id?: number;
  show_price?: boolean;
  show_description?: boolean;
  show_add_to_cart?: boolean;
  websiteSubdomain?: string;
}

export function ProductGrid({
  title = 'Our Products',
  description,
  columns = 3,
  max_products = 12,
  filter = 'all',
  category_id,
  brand_id,
  show_price = true,
  show_description = false,
  show_add_to_cart = true,
  websiteSubdomain
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!websiteSubdomain) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          filter,
          category_id,
          brand_id,
          limit: max_products
        };

        const fetchedProducts = await apiClient.getProducts(websiteSubdomain, filters);
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [websiteSubdomain, filter, category_id, brand_id, max_products]);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
            {Array.from({ length: max_products }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showPrice={show_price}
              showDescription={show_description}
              showAddToCart={show_add_to_cart}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  showPrice: boolean;
  showDescription: boolean;
  showAddToCart: boolean;
}

function ProductCard({ product, showPrice, showDescription, showAddToCart }: ProductCardProps) {
  const primaryImage = product.images?.[0] || '/placeholder-product.jpg';
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Sale
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        
        {showDescription && product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
        )}

        {showPrice && (
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-600">
                  ${product.sale_price?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {showAddToCart && (
          <button
            disabled={product.stock_quantity === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}