<?php 

namespace App\Http\Controllers\Api\v1;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum']], function () {

    // Get owned store list
    Route::get('/get-stores', [StoreController::class, 'index']);
    
    // Select an authorized store
    Route::post('/switch-store', [StoreController::class, 'switchStore']);
     
    // get current store information
    Route::get('/current-store', [StoreController::class, 'currentStore']);
});


Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {
       
    // Shop or Store Routes
    Route::resource('/store', StoreController::class);

    // Brand Routes
    Route::resource('/brand', BrandController::class);

    // Product Category Routes
    Route::resource('/category', CategoryController::class);

    // Product Route
    Route::resource('/product', ProductController::class);

    // // Blog Category Route
    // Route::resource('/blog-category', BlogCategoryController::class);
    
     
});




