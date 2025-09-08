'use client';

import React, { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Website, WebsitePage } from '@/types';
import { WebsiteLayout } from '@/components/WebsiteLayout';
import { PageRenderer } from '@/components/PageRenderer';
import { useAuth } from '@/contexts/AuthContext';

// Note: Route segment config (dynamic, revalidate) cannot be used in client components
// Cache control is handled by the API routes and Next.js config instead

interface PageData {
  website: Website;
  page: WebsitePage;
}

function DynamicPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  
  // Get the path from URL params
  const slug = params.slug as string[] || [];
  
  // The entire slug is the page path, not subdomain/path
  // For development, subdomain comes from query param
  const path = slug.join('/');

  // Initialize subdomain on client side only to prevent hydration mismatch
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const querySubdomain = searchParams.get('subdomain');
    let extractedSubdomain = querySubdomain || extractSubdomain();
    
    // Clean the subdomain - remove any path components
    if (extractedSubdomain && extractedSubdomain.includes('/')) {
      extractedSubdomain = extractedSubdomain.split('/')[0];
    }
    
    setSubdomain(extractedSubdomain);
  }, [searchParams]);

  useEffect(() => {
    if (!subdomain) {
      setError('Website subdomain is required. For development, add ?subdomain=your-subdomain to the URL');
      setLoading(false);
      return;
    }

    const fetchWebsiteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Handle special auth pages
        if (path === 'login' || path === 'signup' || path === 'forgot-password') {
          // First get the actual website data for header/footer/menus
          try {
            const websiteData = await apiClient.getWebsite(subdomain, ''); // Get homepage to get website data
            
            // Create auth page with real website data but custom page content
            const authPageData = {
              website: websiteData.website, // Use real website data with header/footer/menus
              page: {
                id: 1,
                title: path === 'login' ? 'Login' : path === 'signup' ? 'Sign Up' : 'Forgot Password',
                slug: path,
                type: 'auth',
                sections: [{
                  id: 1,
                  name: 'Auth Section',
                  type: 'auth-center',
                  sort_order: 1,
                  is_visible: true,
                  components: [{
                    id: 1,
                    name: path === 'login' ? 'Login Form' : path === 'signup' ? 'Signup Form' : 'Reset Password Form',
                    component_type: {
                      id: 1,
                      name: path === 'login' ? 'Login Form' : 'Signup Form',
                      slug: path === 'login' ? 'login-form' : 'signup-form',
                      description: 'Authentication form',
                      category: {
                        id: 1,
                        name: 'Authentication',
                        slug: 'auth'
                      }
                    },
                    props: {
                      title: path === 'login' ? 'Welcome Back' : path === 'signup' ? 'Create Account' : 'Reset Password',
                      form_style: 'card',
                      alignment: 'center'
                    },
                    sort_order: 1,
                    is_visible: true
                  }]
                }]
              }
            };
            setData(authPageData);
            return;
          } catch (err) {
            // If website data fails, fall back to the regular error handling
            setError('Failed to load authentication page');
            return;
          }
        }
        
        // Clear cache if requested via URL parameter
        if (searchParams.get('clearCache') === 'true') {
          apiClient.clearCache();
          // Remove the clearCache parameter from URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('clearCache');
          window.history.replaceState({}, '', newUrl.toString());
        }
        
        const websiteData = await apiClient.getWebsite(subdomain, path);
        setData(websiteData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load website');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, [subdomain, path, searchParams]);

  const extractSubdomain = React.useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      
      // For localhost development, we can't extract from hostname
      // so we rely on query parameters
      if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
        return null; // Will use query parameter
      }
      
      // Check if this is a subdomain (has more than 2 parts)
      if (parts.length > 2) {
        return parts[0];
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to extract subdomain:', error);
      return null;
    }
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!data) {
    return <ErrorState error="Website not found" />;
  }

  return (
    <WebsiteLayout website={data.website} page={data.page}>
      {subdomain ? (
        <PageAccessGuard page={data.page} subdomain={subdomain}>
          <PageRenderer 
            page={data.page} 
            websiteSubdomain={subdomain}
            websiteMenus={data.website.menus}
          />
        </PageAccessGuard>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subdomain...</p>
          </div>
        </div>
      )}
    </WebsiteLayout>
  );
}

// PageAccessGuard component that handles access control inside AuthProvider
interface PageAccessGuardProps {
  page: WebsitePage;
  subdomain: string;
  children: React.ReactNode;
}

function PageAccessGuard({ page, subdomain, children }: PageAccessGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  // ALL HOOKS MUST BE CALLED FIRST - NO HOOKS AFTER EARLY RETURNS
  
  // Ensure this only runs on client side to prevent hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Check page access permissions - this hook MUST be called on every render
  React.useEffect(() => {
    // Skip if not mounted, still loading, or auth pages
    if (!mounted || isLoading || page.type === 'auth') return;
    
    // Check if user has access to this page
    const accessLevel = page.access_level || 'all';
    let hasAccess = true;
    
    switch (accessLevel) {
      case 'guest':
        hasAccess = !isAuthenticated;
        break;
      case 'user':
        hasAccess = isAuthenticated;
        break;
      case 'all':
      default:
        hasAccess = true;
    }
    
    // Handle redirects if no access
    if (!hasAccess) {
      console.log('❌ Access denied for page:', { 
        pageSlug: page.slug, 
        accessLevel, 
        isAuthenticated,
        redirecting: true 
      });
      
      if (accessLevel === 'user' && !isAuthenticated) {
        // Redirect to login page for pages that require authentication
        const currentUrl = window.location.pathname + window.location.search;
        const loginUrl = `/login?subdomain=${subdomain}&redirect=${encodeURIComponent(currentUrl)}`;
        console.log('🔄 Redirecting to login:', loginUrl);
        router.push(loginUrl);
        return;
      }
      
      if (accessLevel === 'guest' && isAuthenticated) {
        // Redirect to homepage for guest-only pages when user is logged in
        const homeUrl = `/?subdomain=${subdomain}`;
        console.log('🔄 Redirecting to homepage:', homeUrl);
        router.push(homeUrl);
        return;
      }
    }
  }, [mounted, page, isAuthenticated, isLoading, subdomain, router]);

  // NOW WE CAN DO EARLY RETURNS - ALL HOOKS HAVE BEEN CALLED

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('🔐 PageAccessGuard:', { 
    pageSlug: page.slug, 
    accessLevel: page.access_level, 
    isAuthenticated, 
    isLoading,
    pageType: page.type 
  });

  // Don't do anything while auth is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Skip access control for auth pages (login, signup, etc.)
  if (page.type === 'auth') {
    console.log('✅ Auth page - skipping access control');
    return <>{children}</>;
  }

  // Check if user has access to the page
  const checkPageAccess = (): boolean => {
    const accessLevel = page.access_level || 'all';
    
    switch (accessLevel) {
      case 'guest':
        return !isAuthenticated;
      case 'user':
        return isAuthenticated;
      case 'all':
      default:
        return true;
    }
  };

  // Check access before rendering
  if (!checkPageAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  console.log('✅ Access granted for page:', page.slug);
  return <>{children}</>;
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading website...</p>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Export the component dynamically to prevent SSR hydration issues
const DynamicPage = nextDynamic(
  () => Promise.resolve(DynamicPageContent),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }
);

export default DynamicPage;