'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { debugCart } from '@/lib/cart-debug';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalAmount: number;
  addToCart: (productId: string, quantity?: number, variantId?: string) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  isLoading: boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  subdomain: string;
}

export function CartProvider({ children, subdomain }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Calculate totals
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Load cart from localStorage on mount (only once)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const cartKey = `cart_${subdomain}`;
      
      // Always load from localStorage first (for immediate display)
      const savedCart = localStorage.getItem(cartKey);
      console.log('🔄 Loading cart from localStorage:', { cartKey, savedCart });
      
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const validItems = Array.isArray(parsed) ? parsed : [];
          console.log('✅ Loaded cart items:', validItems);
          setItems(validItems);
        } catch (error) {
          console.error('❌ Failed to parse saved cart:', error);
          setItems([]);
        }
      } else {
        console.log('📭 No saved cart found');
      }
      
      // Debug cart for troubleshooting
      debugCart(subdomain);
      setIsInitialized(true);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain]);

  // Save cart to localStorage whenever items change (but only after initialization)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const cartKey = `cart_${subdomain}`;
      console.log('💾 Saving cart to localStorage:', { cartKey, items });
      localStorage.setItem(cartKey, JSON.stringify(items));
    }
  }, [items, subdomain, isInitialized]);

  const addToCart = async (productId: string, quantity = 1, variantId?: string): Promise<boolean> => {
    console.log('🛒 Adding to cart:', { productId, quantity, variantId, subdomain });
    setIsLoading(true);
    
    try {
      // For authenticated users, call the API directly
      if (isAuthenticated) {
        const tokenKey = `token_${subdomain}`;
        const token = localStorage.getItem(tokenKey);
        
        if (token) {
          try {
            // Call the API to add item to server cart
            const response = await fetch(`/api/cart/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                subdomain,
                product_id: productId,
                quantity,
                variant_id: variantId
              })
            });

            const result = await response.json();
            
            if (result.success) {
              console.log('✅ Item added to server cart via API');
              
              // Update local state with server response if provided
              if (result.cart && result.cart.items) {
                setItems(result.cart.items);
              } else {
                // Fallback: Update local cart state
                const existingItemIndex = items.findIndex(
                  item => item.product_id === productId && item.variant_id === variantId
                );

                if (existingItemIndex >= 0) {
                  // Update existing item
                  const updatedItems = [...items];
                  updatedItems[existingItemIndex].quantity += quantity;
                  setItems(updatedItems);
                } else {
                  // Add new item
                  const newItem: CartItem = {
                    id: result.item_id || `api-${Date.now()}-${productId}`,
                    product_id: productId,
                    variant_id: variantId,
                    quantity,
                    price: 29.99, // Mock price - should come from API
                    product_name: `Product ${productId}`,
                  };
                  setItems([...items, newItem]);
                }
              }

              // Show success notification
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('cart-updated', {
                  detail: { 
                    action: 'add', 
                    productId, 
                    quantity, 
                    totalCount: result.cart_count || items.length + 1 
                  }
                });
                window.dispatchEvent(event);
              }

              return true;
            } else {
              // API failed (backend hooks not available) - fall through to local cart
              console.log('ℹ️ Backend add-to-cart not available:', result.message);
              // Fall through to local cart handling
            }
          } catch (apiError) {
            console.log('ℹ️ API add failed, falling back to local cart:', apiError);
            // Fall through to local cart handling
          }
        }
      }

      // For guest users or API fallback, use local cart only
      console.log('👤 Guest user or API fallback - adding to local cart');
      
      // Add item locally
      const existingItemIndex = items.findIndex(
        item => item.product_id === productId && item.variant_id === variantId
      );

      let updatedItems: CartItem[];
      if (existingItemIndex >= 0) {
        updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `local-${Date.now()}-${productId}`,
          product_id: productId,
          variant_id: variantId,
          quantity,
          price: 29.99, // Mock price for local testing
          product_name: `Product ${productId}`,
        };
        updatedItems = [...items, newItem];
      }

      setItems(updatedItems);

      // Calculate new total count
      const newTotalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      // Show local success notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('cart-updated', {
          detail: { 
            action: 'add', 
            productId, 
            quantity, 
            totalCount: newTotalCount,
            isLocal: true 
          }
        });
        window.dispatchEvent(event);
      }

      return true;
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      
      // Show error notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('cart-error', {
          detail: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
        window.dispatchEvent(event);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First, remove from local state immediately for better UX
      const itemToRemove = items.find(item => item.id === itemId);
      if (!itemToRemove) {
        console.warn('Item to remove not found in cart');
        return false;
      }

      // Update local state immediately for optimistic updates
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);

      // For authenticated users, call the API directly
      if (isAuthenticated) {
        try {
          const tokenKey = `token_${subdomain}`;
          const token = localStorage.getItem(tokenKey);
          
          if (token) {
            // Call the API to remove item from server cart
            const response = await fetch(`/api/cart/remove`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                subdomain,
                item_id: itemId
              })
            });

            const result = await response.json();
            
            if (result.success) {
              console.log('✅ Item removed from server cart via API');
              
              // Update local state with server response if provided
              if (result.cart && result.cart.items) {
                setItems(result.cart.items);
              }
            } else {
              console.log('⚠️ Server remove failed, keeping local change');
            }
          }
        } catch (apiError) {
          console.log('ℹ️ API remove failed, keeping local change:', apiError);
        }
      } else {
        // For guest users, just keep the local change
        console.log('👤 Guest user - item removed locally');
      }

      return true;

    } catch (error) {
      console.error('Remove from cart error:', error);
      // Revert the local change if there's an error
      setItems(items);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    setIsLoading(true);
    
    try {
      // Update local state immediately for optimistic updates
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));

      // For authenticated users, call the API directly
      if (isAuthenticated) {
        try {
          const tokenKey = `token_${subdomain}`;
          const token = localStorage.getItem(tokenKey);
          
          if (token) {
            // Call the API to update item quantity in server cart
            const response = await fetch(`/api/cart/update`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                subdomain,
                item_id: itemId,
                quantity
              })
            });

            const result = await response.json();
            
            if (result.success) {
              console.log('✅ Cart quantity updated on server via API');
              
              // Update local state with server response if provided
              if (result.cart && result.cart.items) {
                setItems(result.cart.items);
              }
            } else {
              console.log('⚠️ Server update failed, keeping local change');
            }
          }
        } catch (apiError) {
          console.log('ℹ️ API update failed, keeping local change:', apiError);
        }
      } else {
        // For guest users, just keep the local change
        console.log('👤 Guest user - quantity updated locally');
      }

      return true;

    } catch (error) {
      console.error('Update cart error:', error);
      // Revert the local change if there's an error
      setItems(items);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setItems([]);
    // Clear from localStorage as well
    if (typeof window !== 'undefined') {
      const cartKey = `cart_${subdomain}`;
      localStorage.removeItem(cartKey);
    }
  };

  // Sync cart with server (for authenticated users)
  const syncCart = async () => {
    if (!isAuthenticated) {
      console.log('📝 User not authenticated, skipping cart sync');
      return;
    }

    // Skip if sync is known to be unavailable
    if (syncAvailable === false) {
      console.log('ℹ️ Cart sync not available, skipping');
      return;
    }

    // Don't sync if we're already syncing
    if (isSyncing) {
      console.log('⏳ Cart sync already in progress, skipping');
      return;
    }

    setIsSyncing(true);
    
    try {
      // Import hooks dynamically
      const { hooks } = await import('@/lib/hooks');
      const executor = hooks.init(subdomain);
      
      // Get token from localStorage
      const tokenKey = `token_${subdomain}`;
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        console.warn('⚠️ No auth token found for cart sync');
        return;
      }

      // If we have local items, merge them with server cart
      if (items.length > 0) {
        console.log('🔄 Attempting to merge local cart with server cart...');
        
        const result = await executor.mergeCart(items, { 
          user_token: token 
        });
        
        if (result.success && result.data) {
          console.log('✅ Cart merged successfully:', result.data);
          setItems(result.data.items || []);
          setSyncAvailable(true);
        } else {
          // Silent failure - just mark sync as unavailable
          setSyncAvailable(false);
        }
      } else {
        // No local items, just fetch server cart
        console.log('📥 Attempting to fetch cart from server...');
        
        const result = await executor.getCart({ 
          user_token: token 
        });
        
        if (result.success && result.data) {
          console.log('✅ Server cart loaded:', result.data);
          setItems(result.data.items || []);
          setSyncAvailable(true);
        } else {
          // Silent failure - just mark sync as unavailable
          setSyncAvailable(false);
        }
      }
    } catch (error) {
      // Gracefully handle errors - don't disrupt the user experience
      // Only log unexpected errors, not missing hook errors
      const errorMessage = error instanceof Error ? error.message : '';
      const isExpectedError = errorMessage.includes('fetch failed') ||
                             errorMessage.includes('not available') ||
                             errorMessage.includes('Cart sync not available');
      
      if (!isExpectedError) {
        console.warn('⚠️ Cart sync error (non-critical):', error);
      }
      
      setSyncAvailable(false);
    } finally {
      setIsSyncing(false);
    }
  };

  // Load and merge user's cart when they authenticate
  const loadAndMergeUserCart = async () => {
    if (!isAuthenticated) return;
    
    const tokenKey = `token_${subdomain}`;
    const token = localStorage.getItem(tokenKey);
    
    if (!token) return;

    try {
      // Get current local cart items
      const localItems = items;
      
      // If user has local cart items, try to merge with server cart
      if (localItems.length > 0) {
        console.log('🔄 Merging local cart with user account...');
        
        // Send each local item to server cart via add API
        for (const item of localItems) {
          try {
            await fetch(`/api/cart/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                subdomain,
                product_id: item.product_id,
                quantity: item.quantity,
                variant_id: item.variant_id
              })
            });
          } catch (error) {
            console.log('Failed to sync item to server:', item.product_id, error);
          }
        }
      }
      
      // Try to load cart from server via API
      const response = await fetch(`/api/cart/get?subdomain=${subdomain}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.cart && result.cart.items) {
          console.log('✅ Loaded merged cart from server:', result.cart.items);
          setItems(result.cart.items);
          return;
        }
      }
      
      console.log('ℹ️ Server cart not available, keeping local cart');
    } catch (error) {
      console.log('ℹ️ Failed to load/merge user cart, keeping local cart:', error);
    }
  };

  // Sync cart when user authentication status changes
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      console.log('👤 User authenticated, loading and merging their cart...');
      loadAndMergeUserCart();
    } else if (isInitialized && !isAuthenticated) {
      // User logged out - cart becomes guest cart (already in localStorage)
      console.log('👤 User logged out, cart is now guest cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isInitialized]);

  // Track if sync is available (to avoid repeated attempts)
  const [syncAvailable, setSyncAvailable] = useState<boolean | null>(null);

  // Sync cart state to server after operations
  const syncCartToServer = async (cartItems: CartItem[]) => {
    // Disable sync until backend hooks are implemented
    console.log('ℹ️ Cart sync disabled (backend hooks not available)');
    return;
    
    if (!isAuthenticated || syncAvailable === false) {
      return;
    }

    try {
      const { hooks } = await import('@/lib/hooks');
      const executor = hooks.init(subdomain);
      
      const tokenKey = `token_${subdomain}`;
      const token = localStorage.getItem(tokenKey);
      
      if (!token) return;

      // Sync the current cart state to server
      const result = await executor.syncCart(cartItems, { 
        user_token: token 
      });
      
      if (result.success) {
        console.log('✅ Cart synced to server');
        setSyncAvailable(true);
      } else {
        setSyncAvailable(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      if (!errorMessage.includes('not available')) {
        console.warn('Cart sync error:', error);
      }
      setSyncAvailable(false);
    }
  };

  // Also sync cart after each cart operation for authenticated users
  const syncCartAfterOperation = async () => {
    // Skip if sync is known to be unavailable
    if (syncAvailable === false) {
      return;
    }
    
    if (isAuthenticated && !isSyncing) {
      // Debounce sync to avoid too many requests
      setTimeout(() => {
        // Use the current items state for syncing
        syncCartToServer(items);
      }, 1000);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      totalCount,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncCart,
      isLoading,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Toast notification component (optional)
export function CartNotifications() {
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      const { action, quantity, totalCount, isLocal } = event.detail;
      const message = `✅ Added ${quantity} item(s) to cart. Total: ${totalCount}`;
      const localMessage = isLocal ? ' (Local mode - backend not connected)' : '';
      console.log(message + localMessage);
      // You could integrate with a toast library here
    };

    const handleCartError = (event: CustomEvent) => {
      const { error } = event.detail;
      console.error(`❌ Cart error: ${error}`);
      // You could show error toasts here
    };

    window.addEventListener('cart-updated', handleCartUpdate as EventListener);
    window.addEventListener('cart-error', handleCartError as EventListener);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate as EventListener);
      window.removeEventListener('cart-error', handleCartError as EventListener);
    };
  }, []);

  return null;
}