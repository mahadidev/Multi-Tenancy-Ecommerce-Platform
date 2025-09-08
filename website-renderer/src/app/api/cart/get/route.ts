import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/cart/get - Get user's cart from server
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!subdomain) {
      return NextResponse.json(
        { success: false, message: 'Subdomain is required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Execute get-cart hook to fetch user's cart
    const response = await fetch(`${API_BASE_URL}/api/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Website-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook: 'get-cart',
        params: {},
        context: {
          subdomain,
          user_token: token
        }
      }),
      cache: 'no-store'
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Get cart API returned non-JSON response, backend may not have get-cart hook');
      return NextResponse.json({
        success: false,
        cart: { items: [], total: 0 },
        message: 'Get cart not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || { items: [], total: 0 },
      message: data.message
    });
  } catch (error) {
    console.error('Get cart API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        cart: { items: [], total: 0 },
        message: error instanceof Error ? error.message : 'Failed to get cart'
      },
      { status: 500 }
    );
  }
}