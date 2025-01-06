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
    require __DIR__ . '/api/v1/user.php';

    // Seller Routes
    Route::post('seller/login', [AuthController::class, 'sellerLogin']);
    Route::post('seller/register', [AuthController::class, 'sellerRegister']);

    // User Routes
    Route::post('user/login', [AuthController::class, 'userLogin']);
    Route::post('user/register', [AuthController::class, 'userRegister']);


    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::get('seller/logout', [AuthController::class, 'logout']);
        Route::get('user/logout', [AuthController::class, 'logout']);
    });
});







// User Module Routes
// Route::resource('/user', UserController::class);
