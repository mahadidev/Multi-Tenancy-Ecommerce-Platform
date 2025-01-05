<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {

    // Include the seller routes
    require __DIR__ . '/api/v1/seller.php';

    // Include the site routes
    require __DIR__ . '/api/v1/site.php';

    // Include the customer routes
    require __DIR__ . '/api/v1/customer.php';

    // Auth Routes

    // Seller Routes
    Route::post('seller/login', [AuthController::class, 'sellerLogin']);
    Route::post('seller/register', [AuthController::class, 'sellerRegister']);
    Route::get('seller/logout', [AuthController::class, 'profile']);

    // Customer Routes
    Route::post('customer/login', [AuthController::class, 'customerLogin']);
    Route::post('customer/register', [AuthController::class, 'customerRegister']);
    Route::get('customer/logout', [AuthController::class, 'logout']);



});







// User Module Routes
// Route::resource('/user', UserController::class);


