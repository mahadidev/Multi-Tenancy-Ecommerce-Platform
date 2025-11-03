// Main actions module exports
// These actions are passed as props to theme components

// Cart Actions
export type { CartActions, CartItem } from './Cart';
export { CartActionsImpl } from './Cart';

// Auth Actions  
export type { AuthActions, LoginCredentials, RegisterData } from './Auth';
export { AuthActionsImpl } from './Auth';

// Action Types Bundle - for easy importing
export interface ThemeActions {
  cart: import('./Cart').CartActions;
  auth: import('./Auth').AuthActions;
}

// Action Provider and Hooks
export { ActionProvider } from './ActionProvider';
export { useThemeActions, useCartActions, useAuthActions } from './hooks';

// Example usage in components:
// interface ProductCardProps {
//   product: Product;
//   cartActions?: CartActions;
// }
//
// In theme development (demo):
// <ProductCard 
//   product={product} 
//   cartActions={new CartActionsImpl()}
// />
//
// In production (website-renderer):
// <ProductCard 
//   product={product} 
//   cartActions={productionCartActions} // Real implementation from website-renderer
// />