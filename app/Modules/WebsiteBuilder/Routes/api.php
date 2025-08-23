<?php

use Illuminate\Support\Facades\Route;
use App\Modules\WebsiteBuilder\Controllers\StoreWebsiteController;
use App\Modules\WebsiteBuilder\Controllers\WebsitePageController;
use App\Modules\WebsiteBuilder\Controllers\ComponentController;
use App\Modules\WebsiteBuilder\Controllers\WebsiteTemplateController;
use App\Modules\WebsiteBuilder\Controllers\WebsiteAssetController;
use App\Modules\WebsiteBuilder\Controllers\WebsiteMenuController;
use App\Modules\WebsiteBuilder\Controllers\WebsiteFormController;
use App\Modules\WebsiteBuilder\Controllers\PageSectionController;
use App\Modules\WebsiteBuilder\Controllers\WebsiteRenderController;
use App\Modules\WebsiteBuilder\Controllers\WebsiteSettingsController;

Route::prefix('api/v1')->middleware(['auth:sanctum'])->group(function () {
    
    // Website management routes
    Route::prefix('websites')->group(function () {
        Route::get('/', [StoreWebsiteController::class, 'index']);
        Route::post('/', [StoreWebsiteController::class, 'store']);
        Route::get('/{id}', [StoreWebsiteController::class, 'show']);
        Route::put('/{id}', [StoreWebsiteController::class, 'update']);
        Route::delete('/{id}', [StoreWebsiteController::class, 'destroy']);
        
        // Website actions
        Route::post('/{id}/publish', [StoreWebsiteController::class, 'publish']);
        Route::post('/{id}/unpublish', [StoreWebsiteController::class, 'unpublish']);
        Route::post('/{id}/duplicate', [StoreWebsiteController::class, 'duplicate']);
        Route::post('/create-from-template', [StoreWebsiteController::class, 'createFromTemplate']);
        
        // Page management
        Route::prefix('/{websiteId}/pages')->group(function () {
            Route::get('/', [WebsitePageController::class, 'index']);
            Route::post('/', [WebsitePageController::class, 'store']);
            Route::get('/{pageId}', [WebsitePageController::class, 'show']);
            Route::put('/{pageId}', [WebsitePageController::class, 'update']);
            Route::delete('/{pageId}', [WebsitePageController::class, 'destroy']);
            Route::post('/{pageId}/duplicate', [WebsitePageController::class, 'duplicate']);
            Route::post('/{pageId}/set-homepage', [WebsitePageController::class, 'setHomepage']);
        });
        
        Route::post('/{websiteId}/pages/reorder', [WebsitePageController::class, 'reorder']);
    });

    // Website settings management
    Route::prefix('website-settings')->group(function () {
        Route::get('/', [WebsiteSettingsController::class, 'index']);
        Route::put('/basic', [WebsiteSettingsController::class, 'updateBasicSettings']);
        Route::put('/seo', [WebsiteSettingsController::class, 'updateSeoSettings']);
        Route::put('/analytics', [WebsiteSettingsController::class, 'updateAnalyticsSettings']);
        Route::put('/styles', [WebsiteSettingsController::class, 'updateGlobalStyles']);
        Route::put('/social-media', [WebsiteSettingsController::class, 'updateSocialMedia']);
        Route::put('/maintenance', [WebsiteSettingsController::class, 'toggleMaintenanceMode']);
    });

    // Page sections management
    Route::prefix('pages/{pageId}/sections')->group(function () {
        Route::get('/', [PageSectionController::class, 'index']);
        Route::post('/', [PageSectionController::class, 'store']);
        Route::get('/{sectionId}', [PageSectionController::class, 'show']);
        Route::put('/{sectionId}', [PageSectionController::class, 'update']);
        Route::delete('/{sectionId}', [PageSectionController::class, 'destroy']);
        Route::post('/{sectionId}/duplicate', [PageSectionController::class, 'duplicate']);
    });

    // Component management
    Route::prefix('components')->group(function () {
        Route::get('/categories', [ComponentController::class, 'getCategories']);
        Route::get('/types', [ComponentController::class, 'getComponentTypes']);
        Route::get('/types/{id}', [ComponentController::class, 'getComponentType']);
        
        Route::post('/', [ComponentController::class, 'addComponent']);
        Route::put('/{id}', [ComponentController::class, 'updateComponent']);
        Route::delete('/{id}', [ComponentController::class, 'deleteComponent']);
        Route::post('/{id}/duplicate', [ComponentController::class, 'duplicateComponent']);
        Route::post('/reorder', [ComponentController::class, 'reorderComponents']);
        Route::post('/move', [ComponentController::class, 'moveComponent']);
    });

    // Website templates
    Route::prefix('templates')->group(function () {
        Route::get('/', [WebsiteTemplateController::class, 'index']);
        Route::get('/{id}', [WebsiteTemplateController::class, 'show']);
        Route::get('/{id}/preview', [WebsiteTemplateController::class, 'preview']);
    });

    // Asset management
    Route::prefix('websites/{websiteId}/assets')->group(function () {
        Route::get('/', [WebsiteAssetController::class, 'index']);
        Route::post('/', [WebsiteAssetController::class, 'upload']);
        Route::delete('/{assetId}', [WebsiteAssetController::class, 'destroy']);
    });

    // Menu management
    Route::prefix('websites/{websiteId}/menus')->group(function () {
        Route::get('/', [WebsiteMenuController::class, 'index']);
        Route::post('/', [WebsiteMenuController::class, 'store']);
        Route::get('/{menuId}', [WebsiteMenuController::class, 'show']);
        Route::put('/{menuId}', [WebsiteMenuController::class, 'update']);
        Route::delete('/{menuId}', [WebsiteMenuController::class, 'destroy']);
    });

    // Form management
    Route::prefix('websites/{websiteId}/forms')->group(function () {
        Route::get('/', [WebsiteFormController::class, 'index']);
        Route::post('/', [WebsiteFormController::class, 'store']);
        Route::get('/{formId}', [WebsiteFormController::class, 'show']);
        Route::put('/{formId}', [WebsiteFormController::class, 'update']);
        Route::delete('/{formId}', [WebsiteFormController::class, 'destroy']);
        Route::get('/{formId}/submissions', [WebsiteFormController::class, 'getSubmissions']);
        Route::post('/{formId}/submissions/{submissionId}/mark-read', [WebsiteFormController::class, 'markSubmissionAsRead']);
    });
});

// Public website rendering routes (no auth required)
Route::prefix('sites')->group(function () {
    Route::get('/{subdomain}', [WebsiteRenderController::class, 'renderHomepage']);
    Route::get('/{subdomain}/{slug}', [WebsiteRenderController::class, 'renderPage']);
    Route::get('/{subdomain}/api/products', [WebsiteRenderController::class, 'getProducts']);
    Route::get('/{subdomain}/api/search', [WebsiteRenderController::class, 'searchProducts']);
    Route::post('/{subdomain}/forms/{formId}/submit', [WebsiteRenderController::class, 'submitForm']);
});

// API routes for Next.js website renderer (no auth required)
Route::prefix('api/website')->group(function () {
    // Website rendering
    Route::prefix('render')->group(function () {
        Route::get('/{subdomain}', [WebsiteRenderController::class, 'renderHomepage']);
        Route::get('/{subdomain}/{slug}', [WebsiteRenderController::class, 'renderPage']);
    });
    
    // Website data APIs
    Route::get('/{subdomain}/products', [WebsiteRenderController::class, 'getProducts']);
    Route::get('/{subdomain}/search', [WebsiteRenderController::class, 'searchProducts']);
});