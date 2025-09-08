import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_BASE = process.env['LARAVEL_API_BASE'] || 'http://localhost:8000/api';
const DISABLE_CACHE = process.env['DISABLE_CACHE'] === 'true';
const CACHE_REVALIDATE_TIME = parseInt(process.env['CACHE_REVALIDATE_TIME'] || '60');
const ENABLE_CACHE_BUSTING = process.env['ENABLE_CACHE_BUSTING'] === 'true';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');
  
  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
  }

  try {
    const queryParams = new URLSearchParams();
    
    // Forward all query parameters except subdomain
    searchParams.forEach((value, key) => {
      if (key !== 'subdomain') {
        queryParams.set(key, value);
      }
    });

    // Always use the base products endpoint (not page-specific)  
    let apiUrl = `${LARAVEL_API_BASE}/website/${subdomain}/products?${queryParams.toString()}`;
    
    // Add cache busting parameters when enabled
    if (ENABLE_CACHE_BUSTING) {
      apiUrl += `${queryParams.toString() ? '&' : '?'}_t=${Date.now()}&_r=${Math.random()}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(DISABLE_CACHE ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'X-Disable-Cache': '1'
        } : {})
      },
      ...(DISABLE_CACHE ? { cache: 'no-store' } : {})
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    // Create response with appropriate headers
    const nextResponse = NextResponse.json(data);
    
    // Control caching based on environment variables
    if (DISABLE_CACHE) {
      nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      nextResponse.headers.set('Pragma', 'no-cache');
      nextResponse.headers.set('Expires', '0');
      nextResponse.headers.set('ETag', '');
      nextResponse.headers.set('Last-Modified', '');
      nextResponse.headers.set('X-Cache-Disabled', '1');
    } else {
      // Use configured cache revalidate time
      nextResponse.headers.set('Cache-Control', `public, max-age=${CACHE_REVALIDATE_TIME}, stale-while-revalidate=30`);
    }
    
    return nextResponse;

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}