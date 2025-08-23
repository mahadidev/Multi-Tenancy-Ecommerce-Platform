<?php

use App\Modules\SubscriptionManagement\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Public subscription plans endpoint
Route::group(['prefix' => 'api/v1'], function () {
    Route::get('/subscription-plans', [SubscriptionController::class, 'index']);
    Route::get('/subscription-plans/{subscription}', [SubscriptionController::class, 'show']);
});

// Authenticated subscription routes
Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum']], function () {
    // Original working subscription endpoint (perfect payment gateway)
    Route::post('/package-subscription', [SubscriptionController::class, 'subscribePackage']);
    
    // New modular endpoints (for compatibility)
    Route::post('/subscriptions', [SubscriptionController::class, 'subscribe']);
    Route::get('/subscriptions', [SubscriptionController::class, 'getUserSubscriptions']);
    Route::post('/subscriptions/{id}/cancel', [SubscriptionController::class, 'cancelSubscription']);
    Route::put('/subscriptions/{id}', [SubscriptionController::class, 'updateSubscription']);
});

// UddoktaPay webhook and callback routes (no auth required)
Route::group(['prefix' => '/'], function () {
    Route::get('/success', [SubscriptionController::class, 'success'])->name('uddoktapay.success');
    Route::get('/cancel', [SubscriptionController::class, 'cancel'])->name('uddoktapay.cancel');
    Route::post('/webhook', [SubscriptionController::class, 'webhook'])->name('uddoktapay.webhook');
});