// Example: How to use actions in theme components
// This file shows the pattern for passing actions as props

import React from 'react';
import { Product } from '../types';
import { CartActions } from './Cart';
import { AuthActions } from './Auth';

// ============================================
// COMPONENT WITH ACTIONS AS PROPS
// ============================================

interface ProductCardProps {
  product: Product;
  cartActions?: CartActions;
  showAddToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  cartActions,
  showAddToCart = true 
}) => {
  const handleAddToCart = async () => {
    if (!cartActions) {
      console.warn('Cart actions not provided');
      return;
    }
    
    await cartActions.add(product, 1);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {showAddToCart && cartActions && (
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

// ============================================
// LOGIN FORM WITH AUTH ACTIONS
// ============================================

interface LoginFormProps {
  authActions?: AuthActions;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  authActions,
  onSuccess 
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authActions) {
      console.warn('Auth actions not provided');
      return;
    }

    const response = await authActions.login({ email, password });
    if (response.success) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

// ============================================
// USAGE EXAMPLES
// ============================================

import { CartActionsImpl, AuthActionsImpl } from './index';
import { ActionProvider } from './ActionProvider';

// In theme development/demo mode
export const DemoExample = () => {
  return (
    <ActionProvider>
      <ProductCard product={dummyProduct} />
      <LoginForm onSuccess={() => console.log('Login success')} />
    </ActionProvider>
  );
};

// In production (website-renderer provides real actions)
export const ProductionExample = ({ 
  productionActions
}: {
  productionActions: { cart: CartActions; auth: AuthActions };
}) => {
  return (
    <ActionProvider actions={productionActions}>
      <ProductCard product={realProduct} />
      <LoginForm onSuccess={() => window.location.href = '/account'} />
    </ActionProvider>
  );
};

// Or components can receive actions as direct props
export const DirectPropsExample = () => {
  const cartActions = new CartActionsImpl('my_custom_key');
  const authActions = new AuthActionsImpl('my_auth_key');

  return (
    <>
      <ProductCard 
        product={dummyProduct} 
        cartActions={cartActions}
      />
      <LoginForm 
        authActions={authActions}
        onSuccess={() => console.log('Direct props login success')}
      />
    </>
  );
};

// Dummy data for examples
const dummyProduct: Product = {
  id: '1',
  name: 'Sample Product',
  slug: 'sample-product',
  price: 29.99,
  discount_price: 24.99,
  images: ['https://placehold.co/400x400']
};

const sellerProduct = { ...dummyProduct, id: 'seller-1' };
const realProduct = { ...dummyProduct, id: 'prod-123' };