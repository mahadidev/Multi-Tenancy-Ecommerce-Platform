<?php

namespace App\Http\Controllers\Api\v1\seller;
use App\Http\Controllers\Api\v1\ProfileController;
use App\Http\Controllers\Api\v1\AuthController;
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

    // Store Update Route
    Route::post('/store/{id}', [StoreController::class, "updateByPost"]);

    // Profile Route
    Route::get('profile', [ProfileController::class, 'profile']);

    // Update Profile Info Route
    Route::post('profile/update', [ProfileController::class, 'updateProfile']);

    // Password Change Route
    Route::post('profile/password-change', [ProfileController::class, 'passwordChange']);

    // Logout Route
    Route::get('logout', [AuthController::class, 'logout']);
});


Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {

    // Brand Routes
    Route::resource('/brand', BrandController::class);

    Route::resource('/category', CategoryController::class);

    // Product Route
    Route::resource('/product', ProductController::class);

    // Blog Category Route
    Route::resource('/blog-category', BlogCategoryController::class);

    // Blog Route
    Route::resource('/blog', BlogController::class);

    // Store Settings
    Route::get('/settings', [StoreController::class, 'settings']);

    // Contact Routes
    Route::resource('/contact', ContactController::class);

    // Subscriber Routes
    Route::post('/subscriber/{store_id}', [SubscriberController::class, 'store']);

    // Store Pages Routes
    Route::get('stores/{store_id}/pages', [StorePageController::class, 'pages']);
    Route::post('stores/{store_id}/pages/store', [StorePageController::class, 'store']);
    Route::get('stores/{store_id}/pages/{page_id}', [StorePageController::class, 'view']);
    Route::put('stores/{store_id}/pages/update/{page_id}', [StorePageController::class, 'update']);
});






