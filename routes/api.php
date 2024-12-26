<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function() {

    // Auth Routes
    Route::post('login', [AuthController::class, 'login']);

    // User Module Routes
    Route::resource('/user', UserController::class);

    // Category Routes
    Route::resource('/category', CategoryController::class);

    // Shop or Store Routes
    Route::resource('/store', StoreController::class);

});
