<?php

use App\Http\Controllers\GithubController;
use App\Http\Controllers\TestController;
use App\Modules\ThemeManagement\Controllers\ThemeController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
// SubscriptionController is now handled by SubscriptionManagement module

Route::get('/', function () {
    return view("welcome");
});
Route::prefix('/seller')->group(function () {

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
// Route::get('/success', [SubscriptionController::class, 'success'])->name('uddoktapay.success');
// Route::get('/cancel', [SubscriptionController::class, 'cancel'])->name('uddoktapay.cancel');
// Route::post('/webhook', [SubscriptionController::class, 'webhook'])->name('uddoktapay.webhook');

// without middlware routes
Route::withoutMiddleware([
    VerifyCsrfToken::class
])->group(function(){
    // github controller
   Route::post('/deploy', [GithubController::class, "handle"]);
});


// Test Controller
Route::get("/test-product-calculator/{product}", [TestController::class, "productcalculator"]);
