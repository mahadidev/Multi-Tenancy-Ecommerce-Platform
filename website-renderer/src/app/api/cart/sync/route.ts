import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * GET /api/cart/sync - Fetch cart from server for authenticated user
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

    // Execute get-cart hook to fetch server cart
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
      console.warn('Cart sync API returned non-JSON response, backend may not have cart sync endpoint');
      return NextResponse.json({
        success: false,
        cart: { items: [], total: 0 },
        message: 'Cart sync not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || { items: [], total: 0 },
      message: data.message
    });
  } catch (error) {
    console.error('Cart sync GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch cart',
        cart: { items: [], total: 0 }
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart/sync - Sync local cart to server
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { items } = await request.json();

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

    // Execute sync-cart hook to update server cart
    const response = await fetch(`${API_BASE_URL}/api/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Website-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook: 'sync-cart',
        params: { items },
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
      console.warn('Cart sync API returned non-JSON response, backend may not have cart sync endpoint');
      return NextResponse.json({
        success: false,
        cart: { items: [], total: 0 },
        message: 'Cart sync not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || { items: [], total: 0 },
      message: data.message
    });
  } catch (error) {
    console.error('Cart sync POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to sync cart'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart/sync - Merge local and server carts
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { localItems } = await request.json();

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

    // Execute merge-cart hook to merge local and server carts
    const response = await fetch(`${API_BASE_URL}/api/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Website-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook: 'merge-cart',
        params: { local_items: localItems },
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
      console.warn('Cart sync API returned non-JSON response, backend may not have cart sync endpoint');
      return NextResponse.json({
        success: false,
        cart: { items: [], total: 0 },
        message: 'Cart sync not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || { items: [], total: 0 },
      message: data.message
    });
  } catch (error) {
    console.error('Cart merge error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to merge cart'
      },
      { status: 500 }
    );
  }
}