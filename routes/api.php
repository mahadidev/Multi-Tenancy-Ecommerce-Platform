<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
   
    Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {
       
        // Shop or Store Routes
        Route::resource('/store', StoreController::class);

        // Category Routes
        Route::resource('/category', CategoryController::class);

        // Product Route
        Route::resource('/product', ProductController::class);
        
         
    });

    Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum']], function () {
       
        // Auth Routes
        Route::post('/login', [AuthController::class, 'sellerLogin']);

        // Get owned store list
        Route::get('/get-stores', [StoreController::class, 'index']);
        
        // Select an authorized store
        Route::post('/switch-store', [StoreController::class, 'switchStore']);
         
        // get current store information
        Route::get('/current-store', [StoreController::class, 'currentStore']);
    });

   
   
   
    

});



// User Module Routes
    // Route::resource('/user', UserController::class);

// store module
// product module
// profile module
// category module
