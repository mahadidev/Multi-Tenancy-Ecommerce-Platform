'use client';

import React, { useState, useEffect } from 'react';
import { useThemeHooks } from '../../_shared';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import type { Product, ProductCategory, ProductGridProps } from '../../_shared/types';

const ProductGrid: React.FC<ProductGridProps> = ({
  title = 'All Products',
  showFilters = true,
  showSorting = true,
  showSearch = true,
  columns = 3,
  initialLimit = 12,
  className = ''
}) => {
  const { products, store } = useThemeHooks();
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'name',
    priceRange: [0, 1000]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          products.getProducts({ limit: initialLimit }),
          store.getCategories()
        ]);
        
        setProductList(productsData);
        setCategoryList(categoriesData);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProductList([]);
        setCategoryList([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [products, store, initialLimit]);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const filteredProducts = productList.filter(product => {
    if (filters.category && 
        ((typeof product.category === 'object' && product.category.id !== filters.category) || 
         typeof product.category === 'string')) return false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <section className={`section ${className}`}>
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 skeleton" />
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded flex-1 skeleton" />
              <div className="h-10 bg-gray-200 rounded w-32 skeleton" />
              <div className="h-10 bg-gray-200 rounded w-32 skeleton" />
            </div>
          </div>
          <div className={`grid ${gridCols[columns]} gap-6`}>
            {Array.from({ length: initialLimit }).map((_, index) => (
              <div key={index} className="skeleton">
                <div className="aspect-product bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="modern-text-gradient">{title}</span>
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {productList.length} products
          </p>
        </div>

        {/* Filters Bar */}
        {(showSearch || showFilters || showSorting) && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 modern-shadow">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="form-input w-full pl-10"
                    />
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {showFilters && (
                <div>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    <option value="">All Categories</option>
                    {categoryList.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort */}
              {showSorting && (
                <div>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                    className="form-input"
                  >
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`product-grid`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showQuickAdd={true}
                showWishlist={true}
                className="transition-transform duration-300 hover:-translate-y-1"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({ category: '', search: '', sort: 'name', priceRange: [0, 1000] })}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// Search Icon
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default ProductGrid;