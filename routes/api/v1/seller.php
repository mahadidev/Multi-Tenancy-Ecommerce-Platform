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
    Route::get('logout', [AuthController::class, 'logout']);

    // Store Pages Routes
    Route::get('stores/{store_id}/pages', [StorePageController::class, 'index']);
    Route::post('stores/{store_id}/pages/store', [StorePageController::class, 'store']);
    Route::get('stores/{store_id}/pages/{page_id}', [StorePageController::class, 'view']);
    Route::put('stores/{store_id}/pages/update/{page_id}', [StorePageController::class, 'update']);
    Route::delete('stores/{store_id}/pages/delete/{page_id}', [StorePageController::class, 'destroy']);

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

});

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Brand Routes
    Route::resource('/brand', BrandController::class);

    Route::resource('/category', CategoryController::class);

    // Product Route
    Route::resource('/product', ProductController::class);

    // Product Review Route
    Route::resource('product-reviews', ProductReviewController::class)->only(['index', 'destroy']);

    // Blog Category Route
    Route::resource('/blog-category', CategoryController::class);

    // Blog Route
    Route::resource('/blog', BlogController::class);

    // Subscriber Routes
    Route::post('/subscriber/{store_id}', [SubscriberController::class, 'store']);

    // Store Social Media Routes
    Route::resource('/store-social-media', StoreSocialMediaController::class);

});
