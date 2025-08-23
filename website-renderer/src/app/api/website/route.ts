import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_BASE = process.env.LARAVEL_API_BASE || 'http://localhost:8000/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');
  const path = searchParams.get('path') || '';

  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
  }

  try {
    // For testing, use the mock endpoint
    if (subdomain === 'test-store') {
      const response = await fetch(`http://localhost:8000/test-website-data`);
      
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch test website data' }, { status: 500 });
      }

      const result = await response.json();
      return NextResponse.json(result);
    }

    let apiUrl: string;
    
    if (path === '' || path === '/') {
      // Homepage
      apiUrl = `${LARAVEL_API_BASE}/website/render/${subdomain}`;
    } else {
      // Specific page
      const slug = path.replace(/^\//, ''); // Remove leading slash
      apiUrl = `${LARAVEL_API_BASE}/website/render/${subdomain}/${slug}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching website data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website data' },
      { status: 500 }
    );
  }
}