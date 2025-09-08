import { apiClient } from './api';

export interface HookExecutionResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AddToCartParams {
  product_id: string;
  quantity?: number;
  variant_id?: string;
}

export interface AddToCartResult {
  success: boolean;
  cart_id: string;
  item_id: string;
  cart_count: number;
}

export interface CartData {
  items: Array<{
    id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    price: number;
    product_name: string;
    product_image?: string;
  }>;
  total: number;
}

export interface UserLoginParams {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UserLoginResult {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface UserSignupParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface UserSignupResult {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

export interface NewsletterSignupParams {
  email: string;
  name?: string;
}

/**
 * Hook execution utility class
 */
export class HookExecutor {
  private subdomain: string;

  constructor(subdomain: string) {
    this.subdomain = subdomain;
  }

  /**
   * Execute any hook with custom parameters
   */
  async execute<T = any>(
    hook: string, 
    params: Record<string, any> = {}, 
    context: Record<string, any> = {}
  ): Promise<HookExecutionResult<T>> {
    try {
      const result = await apiClient.executeHook(this.subdomain, hook, params, context);
      
      // If the result indicates the hook is not available, return a graceful failure
      if (!result.success && result.message === 'Hook endpoint not available') {
        // Only log for cart sync hooks if it's the first attempt
        const isCartSyncHook = ['get-cart', 'sync-cart', 'merge-cart'].includes(hook);
        if (!isCartSyncHook) {
          console.log(`ℹ️ Hook '${hook}' not available on backend`);
        }
        return {
          success: false,
          message: `${hook} not available`
        };
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Check if this is an expected missing hook
      const missingHookErrors = ['Hook endpoint not available', 'not available', 'Failed to execute hook'];
      const isExpectedMissingHook = missingHookErrors.some(msg => errorMessage.includes(msg));
      
      // Cart sync hooks are expected to be missing during development
      const isCartSyncHook = ['get-cart', 'sync-cart', 'merge-cart'].includes(hook);
      
      if (isExpectedMissingHook && isCartSyncHook) {
        // Silent failure for cart sync hooks - they're expected to be missing
        return {
          success: false,
          message: `${hook} not available`
        };
      } else if (isExpectedMissingHook) {
        console.log(`ℹ️ Hook '${hook}' not implemented on backend`);
      } else {
        // Only log unexpected errors
        console.error(`Hook execution failed: ${hook}`, error);
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Add product to cart
   */
  async addToCart(params: AddToCartParams, context?: Record<string, any>): Promise<HookExecutionResult<AddToCartResult>> {
    return this.execute<AddToCartResult>('add-to-cart', params, context);
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: string, context?: Record<string, any>): Promise<HookExecutionResult> {
    return this.execute('remove-from-cart', { cart_item_id: cartItemId }, context);
  }

  /**
   * Update cart item quantity
   */
  async updateCart(cartItemId: string, quantity: number, context?: Record<string, any>): Promise<HookExecutionResult> {
    return this.execute('update-cart', { cart_item_id: cartItemId, quantity }, context);
  }

  /**
   * Get user's cart from server
   */
  async getCart(context?: Record<string, any>): Promise<HookExecutionResult<CartData>> {
    return this.execute<CartData>('get-cart', {}, context);
  }

  /**
   * Sync local cart to server
   */
  async syncCart(items: any[], context?: Record<string, any>): Promise<HookExecutionResult<CartData>> {
    return this.execute<CartData>('sync-cart', { items }, context);
  }

  /**
   * Merge local and server carts
   */
  async mergeCart(localItems: any[], context?: Record<string, any>): Promise<HookExecutionResult<CartData>> {
    return this.execute<CartData>('merge-cart', { local_items: localItems }, context);
  }

  /**
   * User login
   */
  async userLogin(params: UserLoginParams, context?: Record<string, any>): Promise<HookExecutionResult<UserLoginResult>> {
    return this.execute<UserLoginResult>('user-login', params, context);
  }

  /**
   * User signup
   */
  async userSignup(params: UserSignupParams, context?: Record<string, any>): Promise<HookExecutionResult<UserSignupResult>> {
    return this.execute<UserSignupResult>('user-signup', params, context);
  }

  /**
   * User logout
   */
  async userLogout(context?: Record<string, any>): Promise<HookExecutionResult> {
    return this.execute('user-logout', {}, context);
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId: string, context?: Record<string, any>): Promise<HookExecutionResult> {
    return this.execute('add-to-wishlist', { product_id: productId }, context);
  }

  /**
   * Add product review
   */
  async addReview(productId: string, rating: number, comment?: string, context?: Record<string, any>): Promise<HookExecutionResult> {
    return this.execute('add-review', { product_id: productId, rating, comment }, context);
  }

  /**
   * Newsletter signup
   */
  async newsletterSignup(params: NewsletterSignupParams, context?: Record<string, any>): Promise<HookExecutionResult> {
    return this.execute('newsletter-signup', params, context);
  }

  /**
   * Process checkout
   */
  async checkout(
    cartId: string,
    shippingAddress: object,
    paymentMethod: string,
    billingAddress?: object,
    context?: Record<string, any>
  ): Promise<HookExecutionResult> {
    return this.execute('checkout', {
      cart_id: cartId,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      payment_method: paymentMethod
    }, context);
  }
}

/**
 * React hook for executing website hooks
 */
export function useHooks(subdomain: string) {
  const executor = new HookExecutor(subdomain);

  return {
    // Core hook executor
    execute: executor.execute.bind(executor),
    
    // Commerce hooks
    addToCart: executor.addToCart.bind(executor),
    removeFromCart: executor.removeFromCart.bind(executor),
    updateCart: executor.updateCart.bind(executor),
    checkout: executor.checkout.bind(executor),
    
    // Auth hooks
    userLogin: executor.userLogin.bind(executor),
    userSignup: executor.userSignup.bind(executor),
    userLogout: executor.userLogout.bind(executor),
    
    // Product hooks
    addToWishlist: executor.addToWishlist.bind(executor),
    addReview: executor.addReview.bind(executor),
    
    // Marketing hooks
    newsletterSignup: executor.newsletterSignup.bind(executor)
  };
}

/**
 * Global hook executor instance
 * Usage: hooks.init('your-subdomain').addToCart({ product_id: '123' })
 */
export const hooks = {
  init: (subdomain: string) => new HookExecutor(subdomain)
};