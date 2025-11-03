'use client';

import React, { createContext, useEffect, useState } from 'react';
import { ThemeHooks } from '../types';
import { PreviewProvider } from './providers/PreviewProvider';
import { DemoProvider } from './providers/DemoProvider';
import { ProductionProvider } from './providers/ProductionProvider';

export const ThemeHookContext = createContext<ThemeHooks | null>(null);

interface ThemeHookProviderProps {
  children: React.ReactNode;
  mode: 'preview' | 'demo' | 'production';
  config?: {
    apiBase?: string;
    storeId?: string;
    token?: string;
  };
}

export const ThemeHookProvider: React.FC<ThemeHookProviderProps> = ({ 
  children, 
  mode,
  config 
}) => {
  const [hookProvider, setHookProvider] = useState<ThemeHooks | null>(null);

  useEffect(() => {
    let provider: ThemeHooks;

    // Direct mode selection - no auto-detection
    switch (mode) {
      case 'preview':
        console.log('🎨 Theme running in PREVIEW mode');
        provider = new PreviewProvider();
        break;
      case 'demo':
        if (!config?.storeId) {
          throw new Error('Demo mode requires storeId in config');
        }
        console.log('🛍️ Theme running in DEMO mode');
        provider = new DemoProvider({
          storeId: config.storeId,
          apiBase: config.apiBase
        });
        break;
      case 'production':
        console.log('🚀 Theme running in PRODUCTION mode');
        provider = new ProductionProvider({
          apiBase: config?.apiBase || '/api/v1/site',
          token: config?.token
        });
        break;
      default:
        throw new Error(`Invalid theme mode: ${mode}`);
    }

    setHookProvider(provider);
  }, [mode, config]);

  if (!hookProvider) {
    // Return loading state or preview provider as fallback
    return (
      <ThemeHookContext.Provider value={new PreviewProvider()}>
        {children}
      </ThemeHookContext.Provider>
    );
  }

  return (
    <ThemeHookContext.Provider value={hookProvider}>
      {children}
    </ThemeHookContext.Provider>
  );
};