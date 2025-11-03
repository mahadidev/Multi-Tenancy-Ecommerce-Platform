import { useContext } from 'react';
import { ActionContext } from './context';

// Hook to use actions in components
export const useThemeActions = () => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error('useThemeActions must be used within ActionProvider');
  }
  return context;
};

// Hook to use specific action
export const useCartActions = () => {
  const { cart } = useThemeActions();
  return cart;
};

export const useAuthActions = () => {
  const { auth } = useThemeActions();
  return auth;
};