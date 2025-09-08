import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * PUT /api/cart/update - Update cart item quantity
 */
export async function PUT(request: NextRequest) {
  try {
    const { subdomain, item_id, quantity } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!subdomain || !item_id || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: 'Subdomain, item_id, and quantity are required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Execute update-cart hook
    const response = await fetch(`${API_BASE_URL}/api/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Website-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook: 'update-cart',
        params: { 
          cart_item_id: item_id,
          quantity: quantity
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
      console.warn('Update cart API returned non-JSON response, backend may not have update-cart hook');
      return NextResponse.json({
        success: false,
        message: 'Cart update not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || null,
      message: data.message
    });
  } catch (error) {
    console.error('Cart update API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update cart'
      },
      { status: 500 }
    );
  }
}