<?php

use App\Modules\ProductManagement\Controllers\ProductController;
use App\Modules\ProductManagement\Controllers\ProductVariantController;
use App\Modules\ProductManagement\Controllers\BrandController;
use App\Modules\ProductManagement\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Brand Routes - Logical permissions: view for anyone with product access, manage for category managers
    Route::prefix('/brand')->group(function () {
        // View brands - anyone with product or category permissions
        Route::middleware(['custom.permission:categories.view,categories.manage,products.view,products.create,products.edit'])->get('/', [BrandController::class, 'index']);
        Route::middleware(['custom.permission:categories.view,categories.manage,products.view,products.create,products.edit'])->get('/{brand}', [BrandController::class, 'show']);
        
        // Manage brands - only category managers
        Route::middleware(['custom.permission:categories.manage'])->post('/', [BrandController::class, 'store']);
        Route::middleware(['custom.permission:categories.manage'])->put('/{brand}', [BrandController::class, 'update']);
        Route::middleware(['custom.permission:categories.manage'])->patch('/{brand}', [BrandController::class, 'update']);
        Route::middleware(['custom.permission:categories.manage'])->delete('/{brand}', [BrandController::class, 'destroy']);
        
        // Export and import - anyone with view access
        Route::middleware(['custom.permission:categories.view,categories.manage,products.view,products.create,products.edit'])->get('/generate/pdf', [BrandController::class, 'pdf']);
        Route::middleware(['custom.permission:categories.view,categories.manage,products.view,products.create,products.edit'])->get('/generate/excel', [BrandController::class, 'excel']);
        Route::middleware(['custom.permission:categories.manage'])->post('/brand-import', [BrandController::class, 'import']);
    });

    // Category Routes - Logical permissions: view for anyone with product access, manage for category managers  
    Route::prefix('/category')->group(function () {
        // View categories - anyone with any category permission
        Route::middleware(['custom.permission:categories.view,categories.create,categories.edit,categories.delete'])->get('/', [CategoryController::class, 'index']);
        Route::middleware(['custom.permission:categories.view,categories.create,categories.edit,categories.delete'])->get('/{category}', [CategoryController::class, 'show']);
        
        // Category operations with granular permissions
        Route::middleware(['custom.permission:categories.create'])->post('/', [CategoryController::class, 'store']);
        Route::middleware(['custom.permission:categories.edit'])->put('/{category}', [CategoryController::class, 'update']);
        Route::middleware(['custom.permission:categories.edit'])->patch('/{category}', [CategoryController::class, 'update']);
        Route::middleware(['custom.permission:categories.delete'])->delete('/{category}', [CategoryController::class, 'destroy']);
        
        // Export and import - view access required
        Route::middleware(['custom.permission:categories.view,categories.create,categories.edit,categories.delete'])->get('/generate/pdf', [CategoryController::class, 'pdf']);
        Route::middleware(['custom.permission:categories.view,categories.create,categories.edit,categories.delete'])->get('/generate/excel', [CategoryController::class, 'excel']);
        Route::middleware(['custom.permission:categories.create'])->post('/category-import', [CategoryController::class, 'import']);
    });

    // Product Routes - Logical permission combinations
    Route::prefix('/product')->group(function () {
        // View products - anyone with any product permission can view
        Route::middleware(['custom.permission:products.view,products.create,products.edit,products.delete,products.manage_stock'])->get('/', [ProductController::class, 'index']);
        Route::middleware(['custom.permission:products.view,products.create,products.edit,products.delete,products.manage_stock'])->get('/{product}', [ProductController::class, 'show']);
        
        // Create products
        Route::middleware(['custom.permission:products.create'])->post('/', [ProductController::class, 'store']);
        
        // Edit products
        Route::middleware(['custom.permission:products.edit'])->put('/{product}', [ProductController::class, 'update']);
        Route::middleware(['custom.permission:products.edit'])->patch('/{product}', [ProductController::class, 'update']);
        
        // Delete products
        Route::middleware(['custom.permission:products.delete'])->delete('/{product}', [ProductController::class, 'destroy']);
        
        // Export and reports - anyone with any product permission can export
        Route::middleware(['custom.permission:products.view,products.create,products.edit,products.delete,products.manage_stock'])->get('/generate/pdf', [ProductController::class, 'pdf']);
        Route::middleware(['custom.permission:products.view,products.create,products.edit,products.delete,products.manage_stock'])->get('/generate/excel', [ProductController::class, 'excel']);
    });
    
    // Product history - require manage stock permission
    Route::middleware(['custom.permission:products.manage_stock'])->get('/products/stock-history', [ProductController::class, "getSummary"]);
    
    // Product Variants - require edit products permission
    Route::middleware(['custom.permission:products.edit'])->resource("/products/{product}/variants", ProductVariantController::class);
});