<?php

use App\Http\Controllers\ThemeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FilamentController;
use App\Http\Controllers\ArtisanController;
use App\Http\Controllers\Api\v1\site\OrderController;
use App\Http\Controllers\UddoktaPayController;
use App\Http\Controllers\Api\v1\seller\SubscriptionController;

// git push webhook
Route::post('/deploy', function (Request $request) {
    $secret = env('GITHUB_WEBHOOK_SECRET');

    $signature = 'sha256=' . hash_hmac('sha256', $request->getContent(), $secret);
    $headerSig = $request->header('X-Hub-Signature-256');

    if (!hash_equals($signature, $headerSig)) {
        Log::error("Invalid GitHub signature.");
        abort(403, 'Invalid signature.');
    }

    $output = shell_exec('cd ' . base_path() . ' && git pull origin main 2>&1');

    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('route:clear');

    Log::info("GitHub Deploy Output:\n" . $output);

    return response("✅ Deployment completed:\n" . nl2br($output));
});

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
    Route::get("/{slug}", [ThemeController::class, "show"]);

    Route::prefix("/{slug}")->group(function () {
        Route::get("/{any}", [ThemeController::class, "show"])->where('any', '.*');
        ;
    });
});


Route::get('/success', [SubscriptionController::class, 'success'])->name('uddoktapay.success');
Route::get('/cancel', [SubscriptionController::class, 'cancel'])->name('uddoktapay.cancel');
Route::post('/webhook', [SubscriptionController::class, 'webhook'])->name('uddoktapay.webhook');
