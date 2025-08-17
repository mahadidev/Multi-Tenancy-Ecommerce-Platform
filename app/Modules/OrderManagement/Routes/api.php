<?php

use App\Modules\OrderManagement\Controllers\OrderController;
use App\Modules\OrderManagement\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Order Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/report', [OrderController::class, 'report']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/update/status/{id}', [OrderController::class, 'updateOrderStatus']);

    // Cart Routes - for Seller panel
    Route::post('cart/add-items', [CartController::class, 'placeOrder']);
    Route::get('cart/items', [CartController::class, 'getCartItems']);
    Route::put('cart/update/items', [CartController::class, 'updateCartItem']);
    Route::delete('cart/delete/items', [CartController::class, 'deleteCartItem']);

    // Order Placement for a user
    Route::post('/place-order', [OrderController::class, 'placeOrder']);
    Route::post('/place-order-non-user', [OrderController::class, 'placeOrderNonUser']);
});