<?php 

namespace App\Http\Controllers\Api\v1;
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
});


Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {
       
    

    // Category Routes
    Route::resource('/category', CategoryController::class);

    // Product Route
    Route::resource('/product', ProductController::class);
    
    // Store Settings
    Route::get('/settings', [StoreController::class, 'settings']);

     
});




