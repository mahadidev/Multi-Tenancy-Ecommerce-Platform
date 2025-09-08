'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useRoutes } from '@/lib/routes';

// Remove the local CartItem interface as we'll use the one from cart context
// import type { CartItem } from '@/contexts/CartContext';

interface CartPageProps {
  title?: string;
  subtitle?: string;
  show_recommended?: boolean;
  show_coupon_field?: boolean;
  show_order_summary?: boolean;
  empty_cart_message?: string;
  continue_shopping_text?: string;
  checkout_button_text?: string;
  websiteSubdomain?: string;
}

export function CartPage({
  title = 'Shopping Cart',
  subtitle = 'Review your items before checkout',
  show_recommended = true,
  show_coupon_field = true,
  show_order_summary = true,
  empty_cart_message = 'Your cart is empty. Start shopping to add items!',
  continue_shopping_text = 'Continue Shopping',
  checkout_button_text = 'Proceed to Checkout',
  websiteSubdomain
}: CartPageProps) {
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, removeFromCart, updateQuantity, totalAmount, isLoading } = useCart();
  const router = useRouter();
  const routes = websiteSubdomain ? useRoutes(websiteSubdomain) : null;
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  // Update quantity using cart context
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    await updateQuantity(itemId, newQuantity);
  };

  // Remove item using cart context
  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError('');
    
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon({
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        description: '10% off your order'
      });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.value / 100);
    }
    return appliedCoupon.value;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      const loginUrl = routes 
        ? routes.buildPageUrl('login') + `&redirect=${encodeURIComponent(window.location.pathname)}`
        : '/login';
      router.push(loginUrl);
      return;
    }

    // Proceed to checkout
    const checkoutUrl = routes ? routes.buildPageUrl('checkout') : '/checkout';
    router.push(checkoutUrl);
  };

  const handleContinueShopping = () => {
    const homeUrl = routes ? routes.buildPageUrl('home') : '/';
    router.push(homeUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{empty_cart_message}</p>
            <button
              onClick={handleContinueShopping}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {continue_shopping_text}
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <div className="divide-y">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">IMG</span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.product_name}</h3>
                          {item.variant_id && (
                            <p className="text-sm text-gray-500">Variant: {item.variant_id}</p>
                          )}
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ${Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              {show_coupon_field && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Coupon Code</h3>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  
                  {couponError && (
                    <p className="text-red-600 text-sm mt-2">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            {show_order_summary && (
              <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
                >
                  {checkout_button_text}
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  className="w-full text-blue-600 hover:text-blue-800 font-medium"
                >
                  {continue_shopping_text}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recommended Products */}
        {show_recommended && cartItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden group cursor-pointer">
                  <div className="h-48 bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Recommended Product {i}</h3>
                    <p className="text-gray-600 text-sm mb-2">Great addition to your cart</p>
                    <p className="text-lg font-semibold text-gray-900">${(29.99 + i * 10).toFixed(2)}</p>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;