<?php

namespace App\Http\Controllers\Api\v1\site;

use Illuminate\Support\Facades\Route;


// cart route
Route::post('/add-to-cart', [CartController::class, 'addToCart']);

Route::get('/test', [StoreController::class, 'test']);
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
