import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * DELETE /api/cart/remove - Remove item from cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const { subdomain, item_id } = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!subdomain || !item_id) {
      return NextResponse.json(
        { success: false, message: 'Subdomain and item_id are required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Execute remove-from-cart hook
    const response = await fetch(`${API_BASE_URL}/api/hooks/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Website-Subdomain': subdomain,
      },
      body: JSON.stringify({
        hook: 'remove-from-cart',
        params: { cart_item_id: item_id },
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
      console.warn('Remove cart API returned non-JSON response, backend may not have remove-from-cart hook');
      return NextResponse.json({
        success: false,
        message: 'Cart remove not available on backend'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: data.success || false,
      cart: data.data?.cart || null,
      message: data.message
    });
  } catch (error) {
    console.error('Cart remove API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to remove from cart'
      },
      { status: 500 }
    );
  }
}