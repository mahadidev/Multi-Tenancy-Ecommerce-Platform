'use client';

import React from 'react';
import Head from 'next/head';
import { Website, WebsitePage } from '@/types';
import { HeaderRenderer } from './HeaderRenderer';
import { FooterRenderer } from './FooterRenderer';
import { CartProvider, CartNotifications } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartSyncIndicator } from './CartSyncIndicator';

interface WebsiteLayoutProps {
  website: Website;
  page: WebsitePage;
  children: React.ReactNode;
}

export function WebsiteLayout({ website, page, children }: WebsiteLayoutProps) {
  const seoMeta = {
    ...website.seo_meta,
    ...page.seo_meta,
  };

  const pageTitle = page.title ? `${page.title} - ${website.title}` : website.title;
  const pageDescription = page.description || website.description || seoMeta.description;

  return (
    <AuthProvider subdomain={website.subdomain}>
      <CartProvider subdomain={website.subdomain}>
        <ToastProvider>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* SEO Meta Tags */}
        {seoMeta.keywords && (
          <meta name="keywords" content={seoMeta.keywords} />
        )}
        {seoMeta.author && (
          <meta name="author" content={seoMeta.author} />
        )}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${website.full_domain}${page.slug === 'home' ? '' : `/${page.slug}`}`} />
        {seoMeta.og_image && (
          <meta property="og:image" content={seoMeta.og_image} />
        )}
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {seoMeta.twitter_image && (
          <meta name="twitter:image" content={seoMeta.twitter_image} />
        )}
        
        {/* Favicon */}
        {website.favicon && (
          <link rel="icon" href={website.favicon} />
        )}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://${website.full_domain}${page.slug === 'home' ? '' : `/${page.slug}`}`} />
        
        {/* Global Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Theme container width - defaults to 1140px but can be overridden */
              --container-max-width: ${website.theme_settings?.containerWidth || '1140px'};
              ${website.global_styles ? Object.entries(website.global_styles).map(([key, value]) => 
                `--${key}: ${value};`
              ).join('\n') : ''}
            }
          `
        }} />
        
        {/* Analytics */}
        {website.analytics_settings?.google_analytics && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${website.analytics_settings.google_analytics}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${website.analytics_settings.google_analytics}');
                `,
              }}
            />
          </>
        )}
      </Head>

      <div className="website-container min-h-screen flex flex-col">
        {/* Header Navigation */}
        <HeaderRenderer website={website} />
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <FooterRenderer website={website} />
        
        {/* Cart Notifications */}
        <CartNotifications />
        
        {/* Cart Sync Indicator */}
        <CartSyncIndicator />
        
      </div>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}