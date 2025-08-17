<?php

use App\Modules\StoreManagement\Controllers\StoreController;
use App\Modules\StoreManagement\Controllers\StoreTypeController;
use App\Modules\StoreManagement\Controllers\StoreShipmentController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
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

    // store theme switch
    Route::post("/store/switch-theme/{id}", [StoreController::class, "switchTheme"]);
    
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