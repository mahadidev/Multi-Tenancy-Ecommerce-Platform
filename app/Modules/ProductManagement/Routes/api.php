<?php

use App\Modules\ProductManagement\Controllers\ProductController;
use App\Modules\ProductManagement\Controllers\ProductVariantController;
use App\Modules\ProductManagement\Controllers\BrandController;
use App\Modules\ProductManagement\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Brand Routes
    Route::resource('/brand', BrandController::class);
    Route::get('/brand/generate/pdf', [BrandController::class, 'pdf']);
    Route::get('/brand/generate/excel', [BrandController::class, 'excel']);
    Route::post('/brand-import', [BrandController::class, 'import']);

    // Category Routes
    Route::resource('/category', CategoryController::class);
    Route::get('/category/generate/pdf', [CategoryController::class, 'pdf']);
    Route::get('/category/generate/excel', [CategoryController::class, 'excel']);
    Route::post('/category-import', [CategoryController::class, 'import']);

    // Product Route
    Route::resource('/product', ProductController::class);
    Route::get('/product/generate/pdf', [ProductController::class, 'pdf']);
    Route::get('/product/generate/excel', [ProductController::class, 'excel']);
    
    // product history
    Route::get('/products/stock-history', [ProductController::class, "getSummary"]);
    
    // Product Variants
    Route::resource("/products/{product}/variants", ProductVariantController::class);
});