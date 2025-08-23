'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Website, WebsitePage } from '@/types';
import { WebsiteLayout } from '@/components/WebsiteLayout';
import { PageRenderer } from '@/components/PageRenderer';

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
  const path = slug.length > 0 ? slug.join('/') : '';

  // Initialize subdomain on client side only to prevent hydration mismatch
  useEffect(() => {
    const querySubdomain = searchParams.get('subdomain');
    const extractedSubdomain = querySubdomain || extractSubdomain();
    setSubdomain(extractedSubdomain);
  }, [searchParams]);

  useEffect(() => {
    if (!subdomain) {
      setError('Website subdomain is required');
      setLoading(false);
      return;
    }

    const fetchWebsiteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const websiteData = await apiClient.getWebsite(subdomain, path);
        setData(websiteData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load website');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, [subdomain, path]);

  function extractSubdomain(): string | null {
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
const DynamicPage = dynamic(
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