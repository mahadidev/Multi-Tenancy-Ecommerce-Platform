'use client';

import React, { useState } from 'react';
import { useHooks } from '@/lib/hooks';

interface AddToCartButtonProps {
  productId: string;
  subdomain: string;
  quantity?: number;
  variantId?: string;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

export function AddToCartButton({
  productId,
  subdomain,
  quantity = 1,
  variantId,
  className = "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200",
  children = "Add to Cart",
  onSuccess,
  onError
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const hooks = useHooks(subdomain);

  const handleAddToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await hooks.addToCart({
        product_id: productId,
        quantity,
        variant_id: variantId
      });

      if (result.success && result.data) {
        console.log('Added to cart successfully:', result.data);
        onSuccess?.(result.data);
        
        // Optional: Show success notification
        if (typeof window !== 'undefined') {
          // You could integrate with a toast library here
          console.log(`Added ${quantity} item(s) to cart. Total items: ${result.data.cart_count}`);
        }
      } else {
        throw new Error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Add to cart error:', errorMessage);
      onError?.(errorMessage);
      
      // Optional: Show error notification
      if (typeof window !== 'undefined') {
        console.error('Failed to add to cart:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Adding...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Example usage component
export function ProductCard({ product, subdomain }: { product: any; subdomain: string }) {
  const handleCartSuccess = (result: any) => {
    console.log('Product added to cart:', result);
    // You could update cart state, show notifications, etc.
  };

  const handleCartError = (error: string) => {
    console.error('Cart error:', error);
    // You could show error notifications, etc.
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-3">${product.price}</p>
      
      <AddToCartButton
        productId={product.id}
        subdomain={subdomain}
        onSuccess={handleCartSuccess}
        onError={handleCartError}
      />
    </div>
  );
}