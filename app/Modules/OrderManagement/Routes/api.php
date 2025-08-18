<?php

use App\Modules\OrderManagement\Controllers\OrderController;
use App\Modules\OrderManagement\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Order Routes - Logical permissions
    Route::prefix('/orders')->group(function () {
        // View orders - anyone with order permissions  
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/', [OrderController::class, 'index']);
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/report', [OrderController::class, 'report']);
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/{id}', [OrderController::class, 'show']);
        
        // Manage orders - order managers only
        Route::middleware(['custom.permission:orders.manage'])->put('/update/status/{id}', [OrderController::class, 'updateOrderStatus']);
    });

    // Cart Routes - for Seller panel (require order management)
    Route::prefix('/cart')->middleware(['custom.permission:orders.manage'])->group(function () {
        Route::post('/add-items', [CartController::class, 'placeOrder']);
        Route::get('/items', [CartController::class, 'getCartItems']);
        Route::put('/update/items', [CartController::class, 'updateCartItem']);
        Route::delete('/delete/items', [CartController::class, 'deleteCartItem']);
    });

    // Order Placement - require order management
    Route::middleware(['custom.permission:orders.manage'])->post('/place-order', [OrderController::class, 'placeOrder']);
    Route::middleware(['custom.permission:orders.manage'])->post('/place-order-non-user', [OrderController::class, 'placeOrderNonUser']);
});