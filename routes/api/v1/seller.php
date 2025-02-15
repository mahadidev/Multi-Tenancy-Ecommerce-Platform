<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Api\v1\ProfileController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\site\ProductReviewController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum']], function () {
    // Get owned store list
    Route::get('/get-stores', [StoreController::class, 'index']);

    // Select an authorized store
    Route::post('/switch-store', [StoreController::class, 'switchStore']);

    // get current store information
    Route::get('/current-store', [StoreController::class, 'currentStore']);

    // Store Routes
    Route::resource('/store', StoreController::class);

    // Store Update Route
    Route::post('/store/{id}', [StoreController::class, 'updateByPost']);

    // Profile Route
    Route::get('profile', [ProfileController::class, 'profile']);

    // Update Profile Info Route
    Route::post('profile/update', [ProfileController::class, 'updateProfile']);

    // Password Change Route
    Route::post('profile/password-change', [ProfileController::class, 'passwordChange']);

    // Contact Routes
    Route::resource('/contact', ContactController::class);

    // Logout Route
    // Route::get('logout', [AuthController::class, 'logout']);

    // Store Pages Route
    Route::get('stores/page', [StorePageController::class, 'index']);
    Route::post('stores/page', [StorePageController::class, 'store']);
    Route::get('stores/page/{page_id}', [StorePageController::class, 'view']);
    Route::put('stores/page/{page_id}', [StorePageController::class, 'update']);
    Route::delete('stores/page/{page_id}', [StorePageController::class, 'destroy']);

    // Store Page Widget Routes
    Route::get('stores/pages/{pageId}/widgets', [StorePageWidgetController::class, 'index']);
    Route::get('stores/pages/{pageId}/widgets/{widgetId}', [StorePageWidgetController::class, 'view']);
    Route::post('stores/pages/{pageId}/widgets/store', [StorePageWidgetController::class, 'store']);
    Route::post('stores/pages/{pageId}/widgets/update/{widgetId}', [StorePageWidgetController::class, 'update']);
    Route::delete('stores/pages/{pageId}/widgets/delete/{widgetId}', [StorePageWidgetController::class, 'destroy']);

    // Store Page Widget Input Routes
    Route::get('stores/pages/widgets/{pageWidgetId}/inputs', [StorePageWidgetInputController::class, 'index']);
    Route::get('stores/pages/widgets/{pageWidgetId}/inputs/{id}', [StorePageWidgetInputController::class, 'show']);
    Route::post('stores/pages/widgets/{pageWidgetId}/inputs/store', [StorePageWidgetInputController::class, 'store']);
    Route::post('stores/pages/widgets/{pageWidgetId}/inputs/update/{id}', [StorePageWidgetInputController::class, 'update']);
    Route::delete('stores/pages/widgets/{pageWidgetId}/inputs/delete/{id}', [StorePageWidgetInputController::class, 'destroy']);

    // Store Page Widget Input Items Routes
    Route::get('stores/pages/widgets/inputs/{inputId}/items', [StorePageWidgetInputItemController::class, 'index']);
    Route::get('stores/pages/widgets/inputs/{inputId}/items/{id}', [StorePageWidgetInputItemController::class, 'show']);
    Route::post('stores/pages/widgets/inputs/{inputId}/items/store', [StorePageWidgetInputItemController::class, 'store']);
    Route::post('stores/pages/widgets/inputs/{inputId}/items/update/{id}', [StorePageWidgetInputItemController::class, 'update']);
    Route::delete('stores/pages/widgets/inputs/{inputId}/items/delete/{id}', [StorePageWidgetInputItemController::class, 'destroy']);

    // customer routes
    Route::resource('customers', CustomerController::class);
    Route::get('customers/generate/pdf', [CustomerController::class, 'pdf']);
    Route::get('customers/generate/excel', [CustomerController::class, 'excel']);
});

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Brand Routes
    Route::resource('/brand', BrandController::class);
    Route::get('/brand/generate/pdf', [BrandController::class, 'pdf']);
    Route::get('/brand/generate/excel', [BrandController::class, 'excel']);
    Route::post('/brand-import', [BrandController::class, 'import']);

    Route::resource('/category', CategoryController::class);
    Route::get('/category/generate/pdf', [CategoryController::class, 'pdf']);
    Route::get('/category/generate/excel', [CategoryController::class, 'excel']);
    Route::post('/category-import', [CategoryController::class, 'import']);

    // Product Route
    Route::resource('/product', ProductController::class);
    Route::get('/product/generate/pdf', [ProductController::class, 'pdf']);
    Route::get('/product/generate/excel', [ProductController::class, 'excel']);

    // Product Review Route
    Route::resource('product-reviews', ProductReviewController::class)->only(['index', 'destroy']);

    // Blog Route
    Route::resource('/blog', BlogController::class);

    // Subscriber Routes
    Route::post('/subscriber/{store_id}', [SubscriberController::class, 'store']);

    // Store Social Media Routes
    Route::resource('/store-social-media', StoreSocialMediaController::class);

    // Analytics Data Route
    Route::get('/analytics', [AnalyticsDataController::class, 'index']);

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/update/status/{id}', [OrderController::class, 'updateOrderStatus']);

    // Cart Routes - for Seller panel
    Route::post('cart/add-items', [CartController::class, 'placeOrder']);
    Route::get('cart/items', [CartController::class, 'getCartItems']);
    Route::put('cart/update/items', [CartController::class, 'updateCartItem']);
    Route::delete('cart/delete/items', [CartController::class, 'deleteCartItem']);

    // Order Placement for a user
    Route::post('/place-order', [OrderController::class, 'placeOrder']);

    // Store Menus Routes
    Route::resource('store-menus', StoreMenuController::class);

    // Store Menu Items Routes
    Route::resource('store-menu-items', StoreMenuItemController::class);

    // Seller role & permission Routes
    Route::resource('store-roles', StoreRoleController::class);
    Route::resource('store-permissions', StorePermissionController::class);

    // Sub-admin role-permission assign
    Route::post('store-assign-role-permissions', [StoreAssignRolePermissionsController::class, 'assignPermissions']);
    Route::post('store-revoke-all-permissions', [StoreAssignRolePermissionsController::class, 'revokeAllPermissions']);

    // 
    Route::resource('admins', AdminController::class);
});

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum']], function () {
    Route::get('logout', [\App\Http\Controllers\Api\v1\AuthController::class, 'logout']);
});
