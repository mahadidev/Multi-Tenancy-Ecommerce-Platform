<?php

use App\Modules\AnalyticsManagement\Controllers\AnalyticsController;
use App\Modules\AnalyticsManagement\Controllers\SalesChartController;
use App\Modules\AnalyticsManagement\Controllers\TrendingProductsController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    
    // Main Analytics Route - Dashboard analytics overview
    Route::middleware(['custom.permission:analytics.view,orders.view,products.view'])->get('/analytics', [AnalyticsController::class, 'index']);
    
    // Sales Chart Routes - Dedicated endpoints for chart data only
    Route::prefix('/sales')->group(function () {
        // Sales chart data - minimal data for charts only
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/chart', [SalesChartController::class, 'chart']);
        
        // Sales metrics summary - lightweight KPI data
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/metrics', [SalesChartController::class, 'metrics']);
        
        // Sales trends with comparison - trend analysis data
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/trends', [SalesChartController::class, 'trends']);
    });

    // Analytics Routes - General analytics (future expansion)
    Route::prefix('/analytics')->group(function () {
        // Trending Products - Dedicated endpoint for trending products data
        // Allow access with either product view permission OR order view permission since it's analytics data
        Route::middleware(['custom.permission:view_product,view_product_analytics,orders.view'])->post('/trending-products', [TrendingProductsController::class, 'getTrendingProducts']);
        
        // Future: Store visitor analytics
        // Route::middleware(['custom.permission:analytics.view'])->get('/visitors', [AnalyticsController::class, 'visitors']);
        
        // Future: Product performance analytics  
        // Route::middleware(['custom.permission:analytics.view'])->get('/products', [AnalyticsController::class, 'products']);
        
        // Future: Customer behavior analytics
        // Route::middleware(['custom.permission:analytics.view'])->get('/customers', [AnalyticsController::class, 'customers']);
        
        // Sales analytics (alternative endpoint)
        Route::middleware(['custom.permission:orders.view,orders.manage'])->get('/sales', [SalesChartController::class, 'chart']);
    });

});