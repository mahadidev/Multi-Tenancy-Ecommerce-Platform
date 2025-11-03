'use client';

import React, { useState, useEffect } from 'react';
import { useThemeHooks } from '../../_shared';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../../_shared/types';

interface RelatedProductsProps {
  title?: string;
  productSource?: {
    type: 'related' | 'similar' | 'featured';
    limit?: number;
    productId?: number;
  };
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  title = 'Related Products',
  productSource = { type: 'featured', limit: 4 }
}) => {
  const { products } = useThemeHooks();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let productsData = [];
        
        if (productSource.type === 'related' && productSource.productId) {
          productsData = await products.getRelatedProducts(productSource.productId);
        } else {
          productsData = await products.getFeaturedProducts();
        }
        
        if (productSource.limit) {
          productsData = productsData.slice(0, productSource.limit);
        }
        
        setProductList(productsData);
      } catch (error) {
        console.error('Failed to load related products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [products, productSource]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (productList.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;