import toast from 'react-hot-toast';
import { Product } from '../../types';
import { CartActions, CartItem } from './CartActions';

/**
 * Demo implementation of CartActions for theme development
 * This is used when developing/previewing themes
 * In production, the website-renderer will provide real implementation
 */
export class CartActionsImpl implements CartActions {
  private cartItems: CartItem[] = [];
  private storageKey: string;

  constructor(storageKey: string = 'demo_cart') {
    this.storageKey = storageKey;
    
    // Load from localStorage for demo mode
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.cartItems = Array.isArray(parsed) ? parsed : [];
        } catch {
          this.cartItems = [];
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    }
  }

  async add(product: Product, quantity = 1, variant?: string): Promise<void> {
    const existingIndex = this.cartItems.findIndex(
      item => item.product.id === product.id && item.variant === variant
    );

    if (existingIndex >= 0) {
      const existingItem = this.cartItems[existingIndex];
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      }
    } else {
      const price = product.discount_price || product.price;
      this.cartItems.push({
        id: `demo-${Date.now()}`,
        product,
        quantity,
        variant,
        price,
        subtotal: quantity * price
      });
    }

    this.saveToStorage();

    toast.success(
      (
        <div>
          <strong>{product.name}</strong> added to cart
          <br />
          <span className="text-sm opacity-75">Quantity: {quantity}</span>
        </div>
      ),
      { duration: 3000 }
    );
  }

  async remove(itemId: string | number): Promise<void> {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveToStorage();
    toast.success('Item removed from cart');
  }

  async update(itemId: string | number, quantity: number): Promise<void> {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.subtotal = quantity * item.price;
      this.saveToStorage();
      toast.success('Cart updated');
    }
  }

  async clear(): Promise<void> {
    this.cartItems = [];
    this.saveToStorage();
    toast.success('Cart cleared');
  }

  getCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Additional method to get cart items (useful for demo)
  getItems(): CartItem[] {
    return this.cartItems;
  }

  // Calculate total (useful for demo)
  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }
}