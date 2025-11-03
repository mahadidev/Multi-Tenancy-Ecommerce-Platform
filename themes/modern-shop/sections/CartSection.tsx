'use client';

import React from 'react';
import { useThemeHooks } from '../../_shared';
import { Button } from '../components/Button';

const CartSection: React.FC = () => {
  const { cart } = useThemeHooks();
  const [cartItems, setCartItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await cart.getCart();
        setCartItems(cartData.items || []);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [cart]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <a href="/shop">
          <Button>Continue Shopping</Button>
        </a>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-b-0">
                  <div className="flex gap-4">
                    <img 
                      src={item.product.thumbnail} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cartItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full">Proceed to Checkout</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;