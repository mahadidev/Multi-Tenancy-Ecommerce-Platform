'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export function CartSyncIndicator() {
  const { isSyncing } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || !isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 z-50">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span className="text-sm text-gray-600">Syncing cart...</span>
    </div>
  );
}

export default CartSyncIndicator;