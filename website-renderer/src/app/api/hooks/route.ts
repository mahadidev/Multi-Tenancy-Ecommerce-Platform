import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.LARAVEL_API_BASE || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const subdomain = url.searchParams.get('subdomain');
    
    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { hook, params, context } = body;

    if (!hook) {
      return NextResponse.json(
        { error: 'Hook name is required' },
        { status: 400 }
      );
    }

    // Forward the request to the Laravel backend
    const backendResponse = await fetch(`${API_BASE_URL}/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook,
        params: params || {},
        context: {
          subdomain,
          ...context,
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        }
      })
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: result.message || 'Hook execution failed' },
        { status: backendResponse.status }
      );
    }

    // Return success response with cache-busting headers
    const response = NextResponse.json(result);
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('Hook API error:', error);
    console.error('API_BASE_URL:', API_BASE_URL);
    console.error('Full backend URL:', `${API_BASE_URL}/hooks/execute`);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Backend connection failed', 
          message: `Could not connect to Laravel backend at ${API_BASE_URL}. Make sure the Laravel server is running.`,
          details: error.message
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        backend_url: `${API_BASE_URL}/hooks/execute`
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Test endpoint to check backend connectivity
  const API_BASE_URL = process.env.LARAVEL_API_BASE || 'http://localhost:8000/api';
  
  try {
    const testResponse = await fetch(`${API_BASE_URL}/test`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    return NextResponse.json({
      message: 'Hooks API is working',
      backend_url: `${API_BASE_URL}`,
      backend_status: testResponse.ok ? 'connected' : 'error',
      backend_status_code: testResponse.status
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Backend connection test',
      backend_url: `${API_BASE_URL}`,
      backend_status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}