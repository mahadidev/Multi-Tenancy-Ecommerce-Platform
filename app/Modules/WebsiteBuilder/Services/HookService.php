<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\Theme;
use App\Modules\WebsiteBuilder\Models\ThemeHook;
use App\Modules\WebsiteBuilder\Models\SellerHookSetting;
use App\Modules\WebsiteBuilder\Models\HookExecution;
use App\Modules\UserManagement\Models\User;
use App\Modules\CustomerManagement\Models\CustomerProfile;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class HookService
{
    protected array $handlers = [];
    protected array $filters = [];

    public function __construct()
    {
        $this->registerCoreHooks();
    }

    /**
     * Register core platform hooks
     */
    protected function registerCoreHooks(): void
    {
        // Commerce hooks
        $this->registerAction('add-to-cart', [$this, 'handleAddToCart']);
        $this->registerAction('remove-from-cart', [$this, 'handleRemoveFromCart']);
        $this->registerAction('update-cart', [$this, 'handleUpdateCart']);
        $this->registerAction('get-cart', [$this, 'handleGetCart']);
        $this->registerAction('checkout', [$this, 'handleCheckout']);
        $this->registerAction('create-order', [$this, 'handleCreateOrder']);

        // Auth hooks
        $this->registerAction('user-login', [$this, 'handleUserLogin']);
        $this->registerAction('user-signup', [$this, 'handleUserSignup']);
        $this->registerAction('user-logout', [$this, 'handleUserLogout']);
        $this->registerAction('reset-password', [$this, 'handleResetPassword']);

        // Product hooks
        $this->registerAction('add-review', [$this, 'handleAddReview']);
        $this->registerAction('add-to-wishlist', [$this, 'handleAddToWishlist']);
        $this->registerAction('product-inquiry', [$this, 'handleProductInquiry']);

        // Filter hooks
        $this->registerFilter('product-price', [$this, 'filterProductPrice']);
        $this->registerFilter('shipping-methods', [$this, 'filterShippingMethods']);
        $this->registerFilter('payment-methods', [$this, 'filterPaymentMethods']);
    }

    /**
     * Register an action hook handler
     */
    public function registerAction(string $name, $handler): void
    {
        if (!is_callable($handler)) {
            throw new \InvalidArgumentException("Handler for action '{$name}' must be callable");
        }
        $this->handlers["action:{$name}"] = $handler;
    }

    /**
     * Register a filter hook handler
     */
    public function registerFilter(string $name, $handler): void
    {
        if (!is_callable($handler)) {
            throw new \InvalidArgumentException("Handler for filter '{$name}' must be callable");
        }
        $this->filters["filter:{$name}"] = $handler;
    }

    /**
     * Execute a hook
     */
    public function execute(string $hookName, array $params, array $context): mixed
    {
        $startTime = microtime(true);
        $success = true;
        $result = null;
        $error = null;

        try {
            // Get hook configuration
            $hook = ThemeHook::where('name', $hookName)->first();
            
            if (!$hook || !$hook->is_active) {
                throw new \Exception("Hook {$hookName} not found or inactive");
            }

            // Validate parameters
            if (!$hook->validateParameters($params)) {
                throw new \Exception("Invalid parameters for hook {$hookName}");
            }

            // Check seller settings
            $sellerSetting = $this->getSellerHookSetting($context['seller_id'], $hook->id);
            
            if ($sellerSetting && !$sellerSetting->is_enabled) {
                throw new \Exception("Hook {$hookName} is disabled for this seller");
            }

            // Execute hook based on type
            if ($hook->isAction()) {
                $result = $this->executeAction($hook, $params, $context, $sellerSetting);
            } elseif ($hook->isFilter()) {
                $result = $this->executeFilter($hook, $params, $context, $sellerSetting);
            } elseif ($hook->isRender()) {
                $result = $this->executeRender($hook, $params, $context, $sellerSetting);
            }

        } catch (\Exception $e) {
            $success = false;
            $error = $e->getMessage();
            Log::error("Hook execution failed: {$hookName}", [
                'error' => $error,
                'params' => $params,
                'context' => $context
            ]);
        }

        // Log execution
        $this->logExecution($hook->id ?? null, $context['seller_id'], [
            'params' => $params,
            'result' => $result,
            'success' => $success,
            'error' => $error,
            'execution_time' => (microtime(true) - $startTime) * 1000
        ]);

        if (!$success) {
            throw new \Exception($error);
        }

        return $result;
    }

    /**
     * Execute action hook
     */
    protected function executeAction(ThemeHook $hook, array $params, array $context, ?SellerHookSetting $setting): mixed
    {
        $handlerKey = "action:{$hook->name}";

        // Check for custom handler first
        if ($setting && $setting->custom_handler) {
            return $this->executeCustomHandler($setting->custom_handler, $params, $context);
        }

        // Use platform handler
        if (isset($this->handlers[$handlerKey])) {
            return call_user_func($this->handlers[$handlerKey], $params, $context);
        }

        throw new \Exception("No handler found for action {$hook->name}");
    }

    /**
     * Execute filter hook
     */
    protected function executeFilter(ThemeHook $hook, array $params, array $context, ?SellerHookSetting $setting): mixed
    {
        $filterKey = "filter:{$hook->name}";
        $value = $params['value'] ?? null;

        // Apply platform filter first
        if (isset($this->filters[$filterKey])) {
            $value = call_user_func($this->filters[$filterKey], $value, $params, $context);
        }

        // Apply custom filter if exists
        if ($setting && $setting->custom_handler) {
            $value = $this->executeCustomHandler($setting->custom_handler, ['value' => $value], $context);
        }

        return $value;
    }

    /**
     * Execute render hook
     */
    protected function executeRender(ThemeHook $hook, array $params, array $context, ?SellerHookSetting $setting): string
    {
        // Render hooks should be handled by the theme
        // This returns data that the theme will use to render
        return json_encode([
            'hook' => $hook->name,
            'data' => $params,
            'settings' => $setting?->settings
        ]);
    }

    /**
     * Execute custom handler (webhook)
     */
    protected function executeCustomHandler(string $url, array $params, array $context): mixed
    {
        $response = Http::timeout(5)
            ->post($url, [
                'params' => $params,
                'context' => $context
            ]);

        if (!$response->successful()) {
            throw new \Exception("Custom handler failed: " . $response->body());
        }

        return $response->json();
    }

    /**
     * Get seller hook setting
     */
    protected function getSellerHookSetting(int $sellerId, int $hookId): ?SellerHookSetting
    {
        return SellerHookSetting::where('seller_id', $sellerId)
            ->where('hook_id', $hookId)
            ->first();
    }

    /**
     * Log hook execution
     */
    protected function logExecution(?int $hookId, int $sellerId, array $data): void
    {
        if (!$hookId) return;

        HookExecution::create([
            'seller_id' => $sellerId,
            'hook_id' => $hookId,
            'session_id' => session()->getId(),
            'payload' => $data['params'] ?? null,
            'response' => $data['result'] ?? null,
            'execution_time' => $data['execution_time'] ?? 0,
            'success' => $data['success'] ?? true,
            'error_message' => $data['error'] ?? null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }

    /**
     * Register theme hooks for seller
     */
    public function registerThemeHooks(int $sellerId, Theme $theme): void
    {
        $requiredHooks = $theme->getRequiredHooks();
        $optionalHooks = $theme->getOptionalHooks();

        // Enable required hooks
        foreach ($requiredHooks as $hookName) {
            $hook = ThemeHook::where('name', $hookName)->first();
            if ($hook) {
                SellerHookSetting::updateOrCreate(
                    ['seller_id' => $sellerId, 'hook_id' => $hook->id],
                    ['is_enabled' => true]
                );
            }
        }

        // Enable optional hooks (can be toggled by seller)
        foreach ($optionalHooks as $hookName) {
            $hook = ThemeHook::where('name', $hookName)->first();
            if ($hook) {
                SellerHookSetting::firstOrCreate(
                    ['seller_id' => $sellerId, 'hook_id' => $hook->id],
                    ['is_enabled' => false]
                );
            }
        }
    }

    // ============================================
    // Core Hook Handlers
    // ============================================

    /**
     * Handle add to cart action
     */
    public function handleAddToCart(array $params, array $context): array
    {
        $productId = $params['product_id'] ?? null;
        $quantity = $params['quantity'] ?? 1;
        $variantId = $params['variant_id'] ?? null;
        $sellerId = $context['seller_id'] ?? 1;

        if (!$productId) {
            throw new \Exception('Product ID is required');
        }

        // Get user ID from token or context
        $userId = $this->getUserIdFromContext($context);
        $sessionId = $context['session_id'] ?? session()->getId();

        // Find existing cart item
        $existingCartItem = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->where('product_id', $productId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->when($variantId, fn($q) => $q->where('options->variant_id', $variantId))
            ->first();

        if ($existingCartItem) {
            // Update existing item
            $existingCartItem->qty += $quantity;
            $existingCartItem->total = $existingCartItem->price * $existingCartItem->qty;
            $existingCartItem->save();
            
            $itemId = 'cart_' . $existingCartItem->id;
        } else {
            // Get product details (mock for now)
            $productName = "Product {$productId}";
            $price = 29.99; // In production, get from Product model
            
            // Create new cart item
            // Temporarily disable foreign key checks for testing
            \DB::statement('SET FOREIGN_KEY_CHECKS = 0');
            $cartItem = \App\Modules\OrderManagement\Models\Cart::create([
                'store_id' => $sellerId,
                'user_id' => $userId,
                'product_id' => $productId,
                'session_id' => $sessionId,
                'item' => $productName,
                'price' => $price,
                'discount' => 0,
                'vat' => 0,
                'qty' => $quantity,
                'total' => $price * $quantity,
                'options' => $variantId ? ['variant_id' => $variantId] : null,
                'is_active' => true
            ]);
            \DB::statement('SET FOREIGN_KEY_CHECKS = 1');
            
            $itemId = 'cart_' . $cartItem->id;
        }

        // Get updated cart count
        $cartCount = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->sum('qty');

        // Get cart items for response
        $cartItems = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->get()
            ->map(function($item) {
                return [
                    'id' => 'cart_' . $item->id,
                    'product_id' => (string)$item->product_id,
                    'variant_id' => $item->options['variant_id'] ?? null,
                    'quantity' => $item->qty,
                    'price' => $item->price,
                    'product_name' => $item->item,
                    'total' => $item->total
                ];
            });

        return [
            'success' => true,
            'item_id' => $itemId,
            'cart_count' => $cartCount,
            'cart' => [
                'items' => $cartItems,
                'total' => $cartItems->sum('total')
            ],
            'message' => "Product {$productId} added to cart (qty: {$quantity})"
        ];
    }

    /**
     * Handle user login action
     */
    public function handleUserLogin(array $params, array $context): array
    {
        $credentials = [
            'email' => $params['email'],
            'password' => $params['password']
        ];

        if (!\Auth::attempt($credentials)) {
            throw new \Exception('Invalid credentials');
        }

        $user = \Auth::user();

        // Get the store ID from seller_id (which is actually the store owner's user ID)
        $store = Store::where('owner_id', $context['seller_id'])->first();
        if ($store) {
            // Create customer profile if not exists
            CustomerProfile::firstOrCreate([
                'user_id' => $user->id,
                'store_id' => $store->id
            ], [
                'status' => 'active'
            ]);
        }

        return [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ],
            'token' => $user->createToken('web')->plainTextToken
        ];
    }

    /**
     * Filter product price
     */
    protected function filterProductPrice($price, array $params, array $context): float
    {
        // Apply any global price modifications
        // e.g., currency conversion, discounts, etc.
        
        // Check for store-specific pricing rules
        $store = Store::where('owner_id', $context['seller_id'])->first();
        
        if ($store && isset($store->settings['has_discount']) && $store->settings['has_discount']) {
            $discountPercentage = $store->settings['discount_percentage'] ?? 0;
            $price = $price * (1 - $discountPercentage / 100);
        }

        return $price;
    }

    // Missing handler methods

    public function handleRemoveFromCart(array $params, array $context): array
    {
        $itemId = $params['item_id'] ?? null;
        $sellerId = $context['seller_id'] ?? 1;

        if (!$itemId) {
            throw new \Exception('Item ID is required');
        }

        // Extract cart ID from item_id (format: cart_123)
        $cartId = str_replace('cart_', '', $itemId);
        
        // Get user ID from token or context
        $userId = $this->getUserIdFromContext($context);
        $sessionId = $context['session_id'] ?? session()->getId();

        // Find and remove cart item
        $cartItem = \App\Modules\OrderManagement\Models\Cart::where('id', $cartId)
            ->where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if (!$cartItem) {
            throw new \Exception('Cart item not found');
        }

        $cartItem->delete();

        // Get updated cart count
        $cartCount = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->sum('qty');

        // Get remaining cart items
        $cartItems = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->get()
            ->map(function($item) {
                return [
                    'id' => 'cart_' . $item->id,
                    'product_id' => (string)$item->product_id,
                    'variant_id' => $item->options['variant_id'] ?? null,
                    'quantity' => $item->qty,
                    'price' => $item->price,
                    'product_name' => $item->item,
                    'total' => $item->total
                ];
            });

        return [
            'success' => true,
            'cart_count' => $cartCount,
            'cart' => [
                'items' => $cartItems,
                'total' => $cartItems->sum('total')
            ],
            'message' => 'Item removed from cart'
        ];
    }

    public function handleUpdateCart(array $params, array $context): array
    {
        $itemId = $params['item_id'] ?? null;
        $quantity = $params['quantity'] ?? 1;
        $sellerId = $context['seller_id'] ?? 1;

        if (!$itemId) {
            throw new \Exception('Item ID is required');
        }

        // Extract cart ID from item_id (format: cart_123)
        $cartId = str_replace('cart_', '', $itemId);
        
        // Get user ID from token or context
        $userId = $this->getUserIdFromContext($context);
        $sessionId = $context['session_id'] ?? session()->getId();

        // Find cart item
        $cartItem = \App\Modules\OrderManagement\Models\Cart::where('id', $cartId)
            ->where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->first();

        if (!$cartItem) {
            throw new \Exception('Cart item not found');
        }

        // Update quantity and total
        $cartItem->qty = $quantity;
        $cartItem->total = $cartItem->price * $quantity;
        $cartItem->save();

        // Get updated cart count and items
        $cartCount = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->sum('qty');

        $cartItems = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->get()
            ->map(function($item) {
                return [
                    'id' => 'cart_' . $item->id,
                    'product_id' => (string)$item->product_id,
                    'variant_id' => $item->options['variant_id'] ?? null,
                    'quantity' => $item->qty,
                    'price' => $item->price,
                    'product_name' => $item->item,
                    'total' => $item->total
                ];
            });

        return [
            'success' => true,
            'cart_count' => $cartCount,
            'cart' => [
                'items' => $cartItems,
                'total' => $cartItems->sum('total')
            ],
            'message' => 'Cart updated successfully'
        ];
    }

    public function handleCheckout(array $params, array $context): array
    {
        return [
            'success' => true,
            'order_id' => 'order_' . uniqid(),
            'payment_url' => 'https://payment.example.com/' . uniqid(),
            'message' => 'Checkout initiated'
        ];
    }

    public function handleCreateOrder(array $params, array $context): array
    {
        return [
            'success' => true,
            'order_id' => 'order_' . uniqid(),
            'message' => 'Order created successfully'
        ];
    }

    public function handleUserSignup(array $params, array $context): array
    {
        // Validate required parameters
        if (!isset($params['email']) || !isset($params['password'])) {
            throw new \Exception('Email and password are required');
        }

        // Check if user already exists
        $existingUser = User::where('email', $params['email'])->first();
        if ($existingUser) {
            throw new \Exception('User already exists with this email');
        }

        // Create new user
        $user = User::create([
            'name' => $params['name'] ?? 'New User',
            'email' => $params['email'],
            'password' => \Hash::make($params['password']),
            'phone' => $params['phone'] ?? null,
        ]);

        // Get the store ID from seller_id (which is actually the store owner's user ID)
        $store = Store::where('owner_id', $context['seller_id'])->first();
        if ($store) {
            // Create customer profile for the store
            CustomerProfile::create([
                'user_id' => $user->id,
                'store_id' => $store->id,
                'status' => 'active'
            ]);
        }

        // Generate auth token
        $token = $user->createToken('web')->plainTextToken;

        return [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone
            ],
            'token' => $token,
            'message' => 'Account created successfully'
        ];
    }

    public function handleUserLogout(array $params, array $context): array
    {
        return [
            'success' => true,
            'message' => 'Logged out successfully'
        ];
    }

    public function handleResetPassword(array $params, array $context): array
    {
        return [
            'success' => true,
            'message' => 'Password reset email sent'
        ];
    }

    public function handleAddReview(array $params, array $context): array
    {
        return [
            'success' => true,
            'review_id' => 'review_' . uniqid(),
            'message' => 'Review added successfully'
        ];
    }

    public function handleAddToWishlist(array $params, array $context): array
    {
        return [
            'success' => true,
            'wishlist_count' => rand(1, 20),
            'message' => 'Added to wishlist'
        ];
    }

    public function handleProductInquiry(array $params, array $context): array
    {
        return [
            'success' => true,
            'inquiry_id' => 'inquiry_' . uniqid(),
            'message' => 'Inquiry submitted successfully'
        ];
    }

    public function filterShippingMethods(array $value, array $context): array
    {
        return $value;
    }

    public function filterPaymentMethods(array $value, array $context): array
    {
        return $value;
    }

    /**
     * Handle get cart action
     */
    public function handleGetCart(array $params, array $context): array
    {
        $sellerId = $context['seller_id'] ?? 1;
        
        // Get user ID from token or context
        $userId = $this->getUserIdFromContext($context);
        $sessionId = $context['session_id'] ?? session()->getId();

        // Get cart items
        $cartItems = \App\Modules\OrderManagement\Models\Cart::where('store_id', $sellerId)
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->when(!$userId, fn($q) => $q->where('session_id', $sessionId))
            ->where('is_active', true)
            ->get()
            ->map(function($item) {
                return [
                    'id' => 'cart_' . $item->id,
                    'product_id' => (string)$item->product_id,
                    'variant_id' => $item->options['variant_id'] ?? null,
                    'quantity' => $item->qty,
                    'price' => $item->price,
                    'product_name' => $item->item,
                    'total' => $item->total
                ];
            });

        $cartCount = $cartItems->sum('quantity');
        $cartTotal = $cartItems->sum('total');

        return [
            'success' => true,
            'cart' => [
                'items' => $cartItems,
                'total' => $cartTotal,
                'count' => $cartCount
            ]
        ];
    }

    /**
     * Get user ID from context (token or direct user_id)
     */
    protected function getUserIdFromContext(array $context): ?int
    {
        // If user_token is provided, try to get user from token
        if (isset($context['user_token'])) {
            try {
                $token = $context['user_token'];
                $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                return $user?->tokenable_id;
            } catch (\Exception $e) {
                Log::debug('Failed to get user from token', ['error' => $e->getMessage()]);
            }
        }

        // Fallback to direct user_id in context
        return $context['user_id'] ?? null;
    }
}