// Main types export file - imports from organized type files

// Auth types
export * from './auth';

// Product types
export * from './product';

// Cart types  
export * from './cart';

// Wishlist types
export * from './wishlist';

// Hook types
export * from './hooks';

// Section types
export * from './sections';

// Checkout types
export * from './checkout';

// Store types
export * from './store';

// Theme configuration types
export interface ThemeConfig {
  name: string;
  version: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  fonts: {
    sans: string[];
    serif?: string[];
    mono?: string[];
  };
  layout: {
    maxWidth: string;
    headerHeight: string;
  };
}