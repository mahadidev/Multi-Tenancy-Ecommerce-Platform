'use client';

import React, { useState, useEffect } from 'react';
import { useThemeHooks } from '../../_shared';
import { ProductCard, Button } from '../components';
import { CartActionsImpl } from '../../_shared/actions';
import type { Product, FeaturedProductsProps } from '../../_shared/types';

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title = 'Featured Products',
  subtitle = 'Discover our most popular and trending items',
  productSource = { type: 'dynamic', query: 'featured', limit: 8 },
  columns = 4,
  showViewAll = true,
  viewAllLink = '/shop',
  className = ''
}) => {
  const { products } = useThemeHooks();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create demo actions for this component
  const cartActions = new CartActionsImpl();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let productList: Product[] = [];

        if (productSource.type === 'static' && productSource.products) {
          // For now, just get regular products since getProductsByIds doesn't exist
          const allProducts = await products.getProducts();
          productList = allProducts.filter(p => productSource.products?.includes(String(p.id)));
        } else {
          productList = await products.getProducts({
            featured: productSource.query === 'featured',
            limit: productSource.limit || 8
          });
        }

        setFeaturedProducts(productList);
      } catch (error) {
        console.error('Failed to load featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [products, productSource]);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  };

  if (loading) {
    return (
      <section className={`section ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 skeleton" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto skeleton" />
          </div>
          
          <div className={`grid ${gridCols[columns]} gap-6`}>
            {Array.from({ length: productSource.limit || 8 }).map((_, index) => (
              <div key={index} className="skeleton">
                <div className="aspect-product bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className={`section ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            <span className="modern-text-gradient">{title}</span>
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className={`grid ${gridCols[columns]} gap-6 mb-12`}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="group">
              <ProductCard
                product={product}
                showQuickAdd={true}
                showWishlist={true}
                className="h-full transition-transform duration-300 group-hover:-translate-y-2"
                onAddToCart={cartActions.add.bind(cartActions)}
              />
            </div>
          ))}
        </div>

        {/* View All */}
        {showViewAll && (
          <div className="text-center">
            <a href={viewAllLink}>
              <Button variant="outline" size="lg" className="modern-shadow hover:modern-shadow-lg">
                View All Products
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

// Arrow Right Icon
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default FeaturedProducts;