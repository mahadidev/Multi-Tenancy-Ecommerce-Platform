<?php 

namespace App\Http\Controllers\Api\v1;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'customer', 'middleware' => ['auth:sanctum']], function () {

    // Get owned store list
    Route::get('/get-stores', [StoreController::class, 'allStores']);
    
    // Select an authorized store
    Route::post('/switch-store', [StoreController::class, 'switchStore2']);
     
    // get current store information
    Route::get('/current-store', [StoreController::class, 'currentStore']);

    // Store Routes
    Route::resource('/store', StoreController::class);
});