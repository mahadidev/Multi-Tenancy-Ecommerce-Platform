import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /api/cart/add - Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const { subdomain, product_id, quantity, variant_id } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!subdomain || !product_id) {
      return NextResponse.json(
        { success: false, message: 'Subdomain and product_id are required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Execute add-to-cart hook
    const response = await fetch(`${API_BASE_URL}/api/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Website-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook: 'add-to-cart',
        params: { 
          product_id, 
          quantity: quantity || 1, 
          variant_id 
        },
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
      console.warn('Add to cart API returned non-JSON response, backend may not have add-to-cart hook');
      return NextResponse.json({
        success: false,
        message: 'Add to cart not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || null,
      item_id: data.data?.item_id || null,
      cart_count: data.data?.cart_count || 0,
      message: data.message
    });
  } catch (error) {
    console.error('Add to cart API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to add to cart'
      },
      { status: 500 }
    );
  }
}