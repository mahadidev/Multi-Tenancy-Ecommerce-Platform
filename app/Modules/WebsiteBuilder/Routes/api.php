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
use App\Modules\WebsiteBuilder\Controllers\WebsiteBuilderController;
use App\Modules\WebsiteBuilder\Controllers\ThemeController;
use App\Modules\WebsiteBuilder\Controllers\ThemeInstallationController;
use App\Modules\WebsiteBuilder\Controllers\HookController;

Route::prefix('api/v1')->group(function () {
    
    // Simple pages endpoint for current store (one store = one website)
    Route::get('/pages', [StoreWebsiteController::class, 'getPages']);
    Route::get('/pages/{pageId}', [StoreWebsiteController::class, 'getPage']);
    
    // Website Builder Theme Management Routes
    Route::prefix('website-themes')->group(function () {
        // Public theme browsing
        Route::get('/', [ThemeInstallationController::class, 'getAvailableThemes']);
        Route::get('/installed', [ThemeController::class, 'installedThemes']);
        Route::post('/{themeId}/install', [ThemeController::class, 'install']);
        Route::post('/{themeId}/reinstall', [ThemeInstallationController::class, 'reinstall']);
        Route::post('/{themeId}/activate', [ThemeController::class, 'activate']);
        Route::get('/{themeSlug}', [ThemeInstallationController::class, 'getThemeDetails']);
        Route::get('/{themeSlug}/preview', [ThemeInstallationController::class, 'previewTheme']);
        
        // Legacy theme routes (keep for backwards compatibility)
        Route::get('/legacy', [ThemeController::class, 'index']);
        Route::get('/legacy/installed', [ThemeController::class, 'installedThemes']);
        Route::get('/legacy/{themeId}', [ThemeController::class, 'show']);
        Route::post('/legacy/{themeId}/install', [ThemeController::class, 'install']);
        Route::post('/legacy/{themeId}/activate', [ThemeController::class, 'activate']);
        
        // Theme customization (keep existing)
        Route::get('/{themeId}/customizations', [ThemeController::class, 'customizations']);
        Route::get('/{themeId}/customizations/active', [ThemeController::class, 'activeCustomization']);
        Route::post('/{themeId}/customizations', [ThemeController::class, 'createCustomization']);
        Route::put('/customizations/{customizationId}', [ThemeController::class, 'updateCustomization']);
        Route::post('/customizations/{customizationId}/duplicate', [ThemeController::class, 'duplicateCustomization']);
        Route::post('/customizations/{customizationId}/activate', [ThemeController::class, 'activateCustomization']);
        Route::put('/customizations/{customizationId}/component-styles', [ThemeController::class, 'updateComponentStyles']);
        
        // Theme preview
        Route::get('/legacy/{themeId}/preview', [ThemeController::class, 'preview']);
        Route::get('/config', [ThemeController::class, 'getThemeConfig']);
    });
    
    // Hook Management Routes
    Route::prefix('hooks')->group(function () {
        Route::get('/', [HookController::class, 'index']);
        Route::get('/{hookId}', [HookController::class, 'show']);
        Route::put('/{hookId}/settings', [HookController::class, 'updateSettings']);
        Route::post('/execute', [HookController::class, 'execute']);
        Route::get('/executions', [HookController::class, 'getExecutions']);
    });

    // Website Builder API routes
    Route::prefix('website-builder')->group(function () {
        // Theme/Template management (legacy - redirect to new theme routes)
        Route::get('/themes', [WebsiteBuilderController::class, 'getThemes']);
        Route::post('/apply-theme', [WebsiteBuilderController::class, 'applyTheme']);
        
        // Component library
        Route::get('/components', [WebsiteBuilderController::class, 'getComponents']);
        
        // Website management
        Route::get('/websites/{websiteId}', [WebsiteBuilderController::class, 'getWebsiteSettings']);
        Route::put('/websites/{websiteId}', [WebsiteBuilderController::class, 'updateWebsiteSettings']);
        
        // Page management (alternative endpoint to avoid model binding issues)
        Route::get('/website-pages', [WebsiteBuilderController::class, 'getWebsitePages']);
        Route::post('/websites/{websiteId}/pages', [WebsiteBuilderController::class, 'createPage']);
        Route::put('/pages/{pageId}/settings', [WebsiteBuilderController::class, 'updatePageSettings']);
        Route::put('/pages/{pageId}/sections', [WebsiteBuilderController::class, 'savePageSections']);
        Route::put('/pages/{pageId}/elementor-data', [WebsiteBuilderController::class, 'saveElementorPageData']);
        Route::post('/pages/{pageId}/duplicate', [WebsiteBuilderController::class, 'duplicatePage']);
        Route::delete('/pages/{pageId}', [WebsiteBuilderController::class, 'deletePage']);
    });
    
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
        
        // Theme installation for specific website
        Route::post('/{websiteId}/themes/install', [ThemeInstallationController::class, 'install']);
        Route::post('/{websiteId}/themes/{themeSlug}/reinstall', [ThemeInstallationController::class, 'reinstall']);
        Route::get('/{websiteId}/theme-installation/status', [ThemeInstallationController::class, 'getInstallationStatus']);
        Route::get('/{websiteId}/theme', [ThemeInstallationController::class, 'getWebsiteTheme']);
        Route::delete('/{websiteId}/theme', [ThemeInstallationController::class, 'uninstallTheme']);
        
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
        
        // Header and Footer management
        Route::get('/{websiteId}/header', [StoreWebsiteController::class, 'getHeader']);
        Route::put('/{websiteId}/header', [StoreWebsiteController::class, 'updateHeader']);
        Route::get('/{websiteId}/footer', [StoreWebsiteController::class, 'getFooter']);
        Route::put('/{websiteId}/footer', [StoreWebsiteController::class, 'updateFooter']);
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
    Route::get('/{subdomain}/{slug}/products', [WebsiteRenderController::class, 'getProducts']);
    Route::get('/{subdomain}/search', [WebsiteRenderController::class, 'searchProducts']);
    Route::get('/{subdomain}/{slug}/search', [WebsiteRenderController::class, 'searchProducts']);
});

// Public hooks API (no auth required)
Route::prefix('api/hooks')->middleware(['hook.rate_limit'])->group(function () {
    Route::post('/execute', [HookController::class, 'executePublic']);
});

// Temporary test routes for website builder (no auth required)
Route::prefix('api/test/website-builder')->group(function () {
    Route::get('/components', [WebsiteBuilderController::class, 'getComponents']);
    Route::get('/themes', [WebsiteBuilderController::class, 'getThemes']);
});

// Temporary test routes for theme installation (no auth required) - REMOVE IN PRODUCTION
Route::prefix('api/test/theme-installation')->group(function () {
    Route::get('/themes', [ThemeInstallationController::class, 'getAvailableThemes']);
    Route::get('/themes/{themeSlug}', [ThemeInstallationController::class, 'getThemeDetails']);
    Route::post('/websites/{websiteId}/install', function(\Illuminate\Http\Request $request, $websiteId) {
        // Mock installation for testing
        return response()->json([
            'success' => true,
            'message' => 'Theme installation started (test mode)',
            'data' => [
                'pages' => [
                    ['id' => 1, 'title' => 'Home', 'slug' => '/', 'type' => 'homepage'],
                    ['id' => 2, 'title' => 'Products', 'slug' => 'products', 'type' => 'catalog'],
                    ['id' => 3, 'title' => 'Cart', 'slug' => 'cart', 'type' => 'cart'],
                ],
                'created_pages_count' => 3,
                'theme' => [
                    'id' => 1,
                    'name' => 'Complete E-commerce',
                    'slug' => 'complete-ecommerce-v1'
                ]
            ]
        ], 201);
    });
    Route::get('/websites/{websiteId}/status', function($websiteId) {
        return response()->json([
            'success' => true,
            'data' => [
                'website_id' => $websiteId,
                'status' => 'completed',
                'progress' => 100,
                'current_step' => 'finalization',
                'errors' => [],
                'is_installing' => false,
                'is_completed' => true,
                'has_errors' => false
            ]
        ]);
    });
});