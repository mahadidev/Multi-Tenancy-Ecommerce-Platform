<?php

namespace App\Http\Controllers\Api\v1\site;

use App\Http\Controllers\Api\v1\PageTypeController;
use App\Http\Controllers\Api\v1\seller\ContactController;

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:sanctum']], function () {
    // cart route
    Route::post('/add-to-cart', [CartController::class, 'addToCart']);

    // product reviews route resource
    Route::resource('product-reviews', ProductReviewController::class)->only(['index', 'store', 'update', 'destroy']);
});


// store show route
Route::get('/store', [StoreController::class, 'show']);

// category route
Route::get('/category', [ProductController::class, 'catgeories']);

// products route
Route::get('/products', [ProductController::class, 'products']);

// all categories wise products route
Route::get('/category/products', [ProductController::class, 'allCategoriesProducts']);

// single category wise products route
Route::get('/category/{slug}/products', [ProductController::class, 'singleCategoryProducts']);

// contact route
Route::post('/contact', [ContactController::class, 'store']);



