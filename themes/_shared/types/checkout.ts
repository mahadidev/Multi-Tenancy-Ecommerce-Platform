import { CartItem } from './cart';

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'demo';
  items: CartItem[];
  total: number;
  shipping: number;
  tax: number;
  discount?: number;
  createdAt: string;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  message: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ShippingMethod {
  id: string;
  method?: string;
  name: string;
  cost: number;
  days: string;
  estimatedDays?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type?: 'card' | 'wallet' | 'bank' | 'crypto';
}

export interface CouponResponse {
  success: boolean;
  discount?: number;
  message: string;
}