<?php

use Illuminate\Support\Facades\Route;
use App\Modules\InventoryManagement\Controllers\ProductStockController;
use App\Modules\InventoryManagement\Controllers\ProductStockHistoryController;

/*
|--------------------------------------------------------------------------
| InventoryManagement API Routes
|--------------------------------------------------------------------------
|
| Here are the routes for the InventoryManagement module.
| These routes handle all product stock and inventory operations.
|
*/

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    
    // Product Stock Routes (Inventory Management)
    Route::resource("/products/{product}/stocks", ProductStockController::class);
    Route::resource("/products/stocks/history", ProductStockHistoryController::class);
    Route::get('/products/{product}/stock-history', [ProductStockHistoryController::class, "productHistory"]);
    
});