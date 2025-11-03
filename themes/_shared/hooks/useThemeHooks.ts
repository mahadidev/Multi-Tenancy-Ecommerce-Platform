import { useContext } from 'react';
import { ThemeHookContext } from './ThemeHookProvider';
import { ThemeHooks } from '../types';

export const useThemeHooks = (): ThemeHooks => {
  const context = useContext(ThemeHookContext);
  
  if (!context) {
    throw new Error('useThemeHooks must be used within ThemeHookProvider');
  }
  
  return context;
};