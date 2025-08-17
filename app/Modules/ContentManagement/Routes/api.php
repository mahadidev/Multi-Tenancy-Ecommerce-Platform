<?php

use App\Modules\ContentManagement\Controllers\BlogController;
use App\Modules\ContentManagement\Controllers\WidgetController;
use App\Modules\ContentManagement\Controllers\StorePageController;
use App\Modules\ContentManagement\Controllers\PageTypeController;
use App\Modules\ContentManagement\Controllers\SvgIconController;
use App\Modules\ContentManagement\Controllers\WidgetTypeController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1'], function () {
    // Widget Routes (public)
    Route::get('widgets/{id?}', [WidgetController::class, 'index']);
    
    // Page types route
    Route::resource('page-types', PageTypeController::class);
    
    // svg icons routes
    Route::resource('svg-icons', SvgIconController::class);

    // Theme Widgets
    Route::get('widget-types', [WidgetTypeController::class, 'index']);
});

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum']], function () {
    // Store Pages Route
    Route::get('stores/page', [StorePageController::class, 'index']);
    Route::post('stores/page', [StorePageController::class, 'store']);
    Route::get('stores/page/{page_id}', [StorePageController::class, 'view']);
    Route::put('stores/page/{page_id}', [StorePageController::class, 'update']);
    Route::delete('stores/page/{page_id}', [StorePageController::class, 'destroy']);
});

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    // Blog Routes
    Route::resource('/blog', BlogController::class);
});