<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
   
    Route::group(['prefix' => 'seller'], function () {
       
        // Shop or Store Routes
        Route::resource('/store', StoreController::class);

        // Category Routes
        // Route::resource('/category', CategoryController::class);
    });

    // Auth Routes
    Route::post('login', [AuthController::class, 'login']);

    // User Module Routes
    Route::resource('/user', UserController::class);

});

// store module
// product module
// profile module
// category module
