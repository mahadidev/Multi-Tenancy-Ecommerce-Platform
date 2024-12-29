<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
   
    Route::group(['prefix' => 'seller', 'middleware' => 'auth:sanctum'], function () {
       
        // Shop or Store Routes
        Route::resource('/store', StoreController::class);

        // Category Routes
        Route::resource('/category', CategoryController::class);

        // Product Route
        Route::resource('/product', ProductController::class);
        
         
    });

    // Auth Routes
    Route::post('/seller/login', [AuthController::class, 'sellerLogin']);

   

    // User Module Routes
    // Route::resource('/user', UserController::class);

});

// store module
// product module
// profile module
// category module
