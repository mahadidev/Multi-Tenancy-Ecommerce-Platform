<?php

use App\Modules\StoreManagement\Controllers\StoreController;
use App\Modules\StoreManagement\Controllers\StoreTypeController;
use App\Modules\StoreManagement\Controllers\StoreShipmentController;
use App\Modules\StoreManagement\Controllers\StoreSocialMediaController;
use Illuminate\Support\Facades\Route;

// Store Creation - Only requires authentication (no store middleware)
Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum']], function () {
    // Store creation endpoint - doesn't require existing store
    Route::post('/store', [StoreController::class, 'store']);
});

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Get owned store list
    Route::get('/get-stores', [StoreController::class, 'index']);

    // Select an authorized store
    Route::post('/switch-store', [StoreController::class, 'switchStore']);

    // get current store information
    Route::get('/current-store', [StoreController::class, 'currentStore']);

    // Store Routes (except creation which is handled above)
    Route::get('/store', [StoreController::class, 'index']);
    Route::get('/store/{store}', [StoreController::class, 'show']);
    Route::put('/store/{store}', [StoreController::class, 'update']);
    Route::delete('/store/{store}', [StoreController::class, 'destroy']);

    // Store Update Route
    Route::post('/store/{id}', [StoreController::class, 'updateByPost']);

    // store theme switch
    Route::post("/store/switch-theme/{id}", [StoreController::class, "switchTheme"]);
    
    // Store Social Media Routes
    Route::get('/store-social-media', [StoreSocialMediaController::class, 'index']);
    Route::post('/store-social-media', [StoreSocialMediaController::class, 'store']);
    Route::put('/store-social-media/{id}', [StoreSocialMediaController::class, 'update']);
    Route::post('/store-social-media/{id}', [StoreSocialMediaController::class, 'update']); // POST fallback for PUT
    Route::delete('/store-social-media/{id}', [StoreSocialMediaController::class, 'destroy']);
    
    // Store Permissions Route (returns empty for now as permissions are handled elsewhere)
    Route::get('/store-permissions', function() {
        return response()->json([
            'status' => 200,
            'message' => 'Store permissions retrieved successfully',
            'data' => []
        ]);
    });
    
    // Shipment Routes
    Route::get('/shipments', [StoreShipmentController::class, 'index']);
    Route::post('steadfast-courier/place-order', [StoreShipmentController::class, 'placeOrder']);
    Route::get('steadfast-courier/track-order/{code}', [StoreShipmentController::class, 'trackOrder']);
    Route::get('steadfast-courier/shipments/sync', [StoreShipmentController::class, 'syncShipments']);
});

Route::group(['prefix' => 'api/v1'], function () {
    // Store Types (public)
    Route::get('store-types', [StoreTypeController::class, 'index']);
});