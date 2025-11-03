'use client';

import React from 'react';
import { ThemeHookProvider } from '../../_shared';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

// Import styles
import '@shared/styles/base.css';
import '../styles/theme.css';

// Import demo data
import demoData from '../demo.json';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get environment from URL params or default to preview
  const environment = 'preview'; // In real app, this would come from context/props
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Modern Shop Theme</title>
        <meta name="description" content="Modern Shop - Built with Next.js and shared foundation" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeHookProvider mode={environment} config={{ storeId: 'demo-store' }}>
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
                    primary: 'rgb(30 64 175)',
                    secondary: '#ffffff',
                  },
                },
              }}
            />

            {/* Navigation */}
            <Navigation
              logo={{ text: 'Modern Shop', href: '/' }}
              menu={[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' }
              ]}
              showCart={true}
              showSearch={true}
            />

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer
              logo={{ text: 'Modern Shop', href: '/' }}
            />
          </div>
        </ThemeHookProvider>
      </body>
    </html>
  );
}