<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {
   
    // Include the seller routes
    require __DIR__ . '/api/v1/seller.php';

    // Auth Routes
    Route::post('seller/login', [AuthController::class, 'sellerLogin']);
    Route::post('seller/register', [AuthController::class, 'sellerRegister']);

});







// User Module Routes
// Route::resource('/user', UserController::class);


