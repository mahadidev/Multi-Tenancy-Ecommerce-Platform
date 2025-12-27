<?php

use App\Http\Controllers\GithubController;
use App\Http\Controllers\TestController;
use App\Modules\ThemeManagement\Controllers\ThemeController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Queue;
// SubscriptionController is now handled by SubscriptionManagement module

// Health check routes
Route::prefix('health')->group(function () {
    Route::get('/', function () {
        try {
            // Check database connection
            $dbStatus = 'connected';
            try {
                DB::connection()->getPdo();
            } catch (\Exception $e) {
                $dbStatus = 'disconnected: ' . $e->getMessage();
            }

            // Check Redis connection
            $redisStatus = 'connected';
            try {
                Redis::ping();
            } catch (\Exception $e) {
                $redisStatus = 'disconnected: ' . $e->getMessage();
            }

            // Check queue status
            $queueSize = 'unknown';
            try {
                $queueSize = Queue::size();
            } catch (\Exception $e) {
                $queueSize = 'error: ' . $e->getMessage();
            }

            // Check cache status
            $cacheStatus = 'connected';
            try {
                cache()->put('health_check', 'ok', 10);
                cache()->get('health_check');
            } catch (\Exception $e) {
                $cacheStatus = 'disconnected: ' . $e->getMessage();
            }

            $status = $dbStatus === 'connected' && $redisStatus === 'connected' ? 'ok' : 'error';

            return response()->json([
                'status' => $status,
                'timestamp' => now()->toISOString(),
                'version' => config('app.version', '1.0.0'),
                'environment' => config('app.env'),
                'services' => [
                    'database' => $dbStatus,
                    'redis' => $redisStatus,
                    'cache' => $cacheStatus,
                    'queue_size' => $queueSize,
                ],
                'system' => [
                    'memory_usage' => round(memory_get_usage(true) / 1024 / 1024, 2) . ' MB',
                    'peak_memory' => round(memory_get_peak_usage(true) / 1024 / 1024, 2) . ' MB',
                    'php_version' => PHP_VERSION,
                    'laravel_version' => app()->version(),
                ]
            ], $status === 'ok' ? 200 : 503);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'timestamp' => now()->toISOString(),
                'error' => $e->getMessage(),
            ], 503);
        }
    });

    Route::get('/simple', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
        ]);
    });
});

Route::get('/', function () {
    return view("welcome");
});

// Add named login route that redirects to seller login
Route::get('/login', function () {
    return redirect('/seller/login');
})->name('login');
Route::prefix('/seller')->group(function () {
    
    Route::get("/login", function () {
        return view("seller.seller");
    })->name('seller.login');

    Route::get("/", function () {
        return view("seller.seller");
    });

    Route::any('/pages/{id}', function () {
        return view("seller.page-editor");
    })->where('any', '.*');

    Route::any('/{any}', function () {
        return view("seller.seller");
    })->where('any', '.*');
});

Route::prefix("/sites")->group(function () {
    Route::get("/{slug}", function($slug){
        return view("site.index", ["slug" => $slug]);
    });

    Route::prefix("/{slug}")->group(function () {
        Route::get("/{any}", function ($slug) {
            return view("site.index", ["slug" => $slug]);
        })->where('any', '.*');
    });
});


Route::prefix("/themes")->group(function () {
    Route::get("/{slug}", [ThemeController::class, "preview"]);

    Route::prefix("/{slug}")->group(function () {
        Route::get("/{any}", [ThemeController::class, "preview"])->where('any', '.*');
        ;
    });
});


// Subscription webhook routes are now handled by SubscriptionManagement module
// See: app/Modules/SubscriptionManagement/Routes/api.php

// without middlware routes
Route::withoutMiddleware([
    VerifyCsrfToken::class
])->group(function(){
    // github controller
   Route::post('/deploy', [GithubController::class, "handle"]);
});


// Test Controller
Route::get("/test-product-calculator/{product}", [TestController::class, "productcalculator"]);

// Test route for website renderer
Route::get('/test-website-data', function () {
    // Create a mock store with website data for testing
    return response()->json([
        'status' => 200,
        'data' => [
            'website' => [
                'id' => 1,
                'title' => 'Test Store',
                'description' => 'A test store for website builder',
                'subdomain' => 'test-store',
                'domain' => null,
                'full_domain' => 'test-store.example.com',
                'favicon' => null,
                'seo_meta' => [],
                'global_styles' => [],
                'analytics_settings' => null,
                'store' => [
                    'id' => 1,
                    'name' => 'Test Store',
                    'logo' => null,
                    'description' => 'A test store',
                    'contact_info' => []
                ],
                'menus' => [
                    [
                        'id' => 1,
                        'name' => 'Main Menu',
                        'location' => 'header',
                        'items' => [
                            ['id' => 1, 'title' => 'Home', 'url' => '/', 'type' => 'page', 'target' => '_self', 'children' => []],
                            ['id' => 2, 'title' => 'About', 'url' => '/about', 'type' => 'page', 'target' => '_self', 'children' => []],
                            ['id' => 3, 'title' => 'Contact', 'url' => '/contact', 'type' => 'page', 'target' => '_self', 'children' => []]
                        ],
                        'styles' => []
                    ]
                ]
            ],
            'page' => [
                'id' => 1,
                'title' => 'Home',
                'slug' => 'home',
                'description' => 'Homepage',
                'type' => 'home',
                'seo_meta' => [],
                'sections' => [
                    [
                        'id' => 1,
                        'name' => 'Hero Section',
                        'type' => 'hero',
                        'container_styles' => [],
                        'sort_order' => 1,
                        'is_visible' => true,
                        'responsive_settings' => [],
                        'components' => [
                            [
                                'id' => 1,
                                'name' => 'Hero Banner',
                                'component_type' => [
                                    'id' => 1,
                                    'name' => 'Hero Section',
                                    'slug' => 'hero-section',
                                    'description' => 'Hero banner component',
                                    'icon' => 'hero',
                                    'default_props' => [],
                                    'schema' => [],
                                    'template' => null,
                                    'styles' => [],
                                    'category' => [
                                        'id' => 1,
                                        'name' => 'Layout',
                                        'slug' => 'layout',
                                        'icon' => 'layout',
                                        'description' => 'Layout components'
                                    ]
                                ],
                                'props' => [
                                    'title' => 'Welcome to Our Store',
                                    'subtitle' => 'Find amazing products',
                                    'description' => 'We have the best products for you.',
                                    'background_color' => '#1f2937'
                                ],
                                'styles' => [],
                                'sort_order' => 1,
                                'is_visible' => true,
                                'responsive_settings' => [],
                                'animation_settings' => []
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]);
});
