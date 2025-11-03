import React from 'react';
import { ThemeHookProvider } from '../hooks';
import { createRenderer, type PageData, type RendererConfig } from './renderer';
import { Toaster } from 'react-hot-toast';

export interface ThemeBaseProps {
  page?: string;
  environment?: 'preview' | 'demo' | 'production';
  config?: {
    storeId?: string;
    apiBase?: string;
  };
  demoData?: any;
  sections?: RendererConfig['sections'];
  children?: React.ReactNode;
}

export interface NavigationProps {
  logo?: {
    text?: string;
    image?: string;
    href?: string;
  };
  menu?: Array<{
    label: string;
    href: string;
  }>;
  showCart?: boolean;
  showSearch?: boolean;
}

export interface FooterProps {
  logo?: {
    text?: string;
    image?: string;
    href?: string;
  };
  tagline?: string;
  sections?: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  socialLinks?: Array<{
    platform: string;
    href: string;
  }>;
  copyright?: string;
}

export interface ThemeComponents {
  Navigation: React.ComponentType<NavigationProps>;
  Footer: React.ComponentType<FooterProps>;
}

export const createThemeBase = (components: ThemeComponents, sections: RendererConfig['sections']) => {
  const { PageRenderer } = createRenderer({ sections });
  
  return function ThemeBase({
    page = 'home',
    environment = 'preview',
    config,
    demoData,
    children
  }: ThemeBaseProps) {
    const { Navigation, Footer } = components;
    
    // Get current page data
    const currentPage: PageData = demoData?.pages?.[page] || demoData?.pages?.home || {
      title: 'Page Not Found',
      slug: '/404',
      sections: []
    };

    return (
      <ThemeHookProvider mode={environment} config={config}>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              },
              success: {
                iconTheme: {
                  primary: 'rgb(var(--color-primary))',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          {/* Navigation */}
          <Navigation
            logo={demoData?.settings?.logo}
            menu={demoData?.menu?.primary}
            showCart={demoData?.settings?.showCart}
            showSearch={demoData?.settings?.showSearch}
          />

          {/* Main Content */}
          <main className="flex-1">
            {children || <PageRenderer page={currentPage} />}
          </main>

          {/* Footer */}
          <Footer
            logo={demoData?.settings?.logo}
          />
        </div>
      </ThemeHookProvider>
    );
  };
};