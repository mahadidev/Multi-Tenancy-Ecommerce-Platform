'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Website, WebsitePage } from '@/types';
import { WebsiteLayout } from '@/components/WebsiteLayout';
import { PageRenderer } from '@/components/PageRenderer';

interface PageData {
  website: Website;
  page: WebsitePage;
}

export function HomePageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before doing any window-dependent operations
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize subdomain on client side only to prevent hydration mismatch
  useEffect(() => {
    if (!isClient) return;
    
    const querySubdomain = searchParams.get('subdomain');
    const extractedSubdomain = querySubdomain || extractSubdomainFromHost();
    setSubdomain(extractedSubdomain);
  }, [searchParams, isClient]);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    
    if (!subdomain) {
      setError('Website subdomain is required');
      setLoading(false);
      return;
    }

    const fetchWebsiteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        // Fetch homepage (empty path)
        const websiteData = await apiClient.getWebsite(subdomain, '');
        clearTimeout(timeoutId);
        
        setData(websiteData);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out after 10 seconds');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load website');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, [subdomain, isClient]);

  function extractSubdomainFromHost(): string | null {
    // Use a client-only extraction for subdomain
    // This function is only called when subdomain prop is not provided
    // Return null on server to prevent hydration issues
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Check if this is a subdomain (has more than 2 parts and isn't localhost)
    if (parts.length > 2 && hostname !== 'localhost') {
      return parts[0];
    }
    
    return null;
  }

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
      <PageRenderer page={data.page} websiteSubdomain={subdomain!} />
    </WebsiteLayout>
  );
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
        
        {/* Development helper */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">Development Mode:</h3>
            <p className="text-sm text-gray-600 mb-2">
              To test a website, add the subdomain as a query parameter:
            </p>
            <code className="text-xs bg-white p-2 rounded block">
              /?subdomain=example-store
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Replace "example-store" with the actual store subdomain.
            </p>
          </div>
        )}
        
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