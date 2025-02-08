<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Api\v1\OnBoarding\OnBoardingController;
use App\Http\Controllers\Api\v1\Auth\SocialLoginController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {

    // Include the seller routes
    require __DIR__ . '/api/v1/seller.php';

    // Include the site routes
    require __DIR__ . '/api/v1/site.php';

    // Include the site routes
    require __DIR__ . '/api/v1/user.php';

    // Include the onboarding routes
    require __DIR__ . '/api/v1/onboarding.php';

    // Seller Routes
    Route::post('seller/login', [AuthController::class, 'sellerLogin']);
    Route::post('seller/register', [AuthController::class, 'sellerRegister']);

    // User Routes
    Route::post('user/login', [AuthController::class, 'userLogin']);
    Route::post('user/register', [AuthController::class, 'userRegister']);

    // User Account - Forgot Password
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);

    // Theme Routes
    Route::get('themes', [ThemeController::class, 'getThemes']);
    Route::get('themes/{id}', [ThemeController::class, 'getTheme']);

    // page types route
    Route::resource('page-types', PageTypeController::class);

    Route::group(['middleware' => ['auth:sanctum']], function () {
        // File storage routes
        Route::resource('file-storage', FileStorageController::class);

        // Notification routes
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::get('notifications/{id}', [NotificationController::class, 'view']);
        Route::get('notifications/mark/all-read', [NotificationController::class, 'markAllAsRead']);
    });

    // Social Login Routes
    Route::get('/auth/google', [SocialLoginController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [SocialLoginController::class, 'UserHandleGoogleCallback']);

    Route::get('/auth/facebook', [SocialLoginController::class, 'redirectToFacebook']);
    Route::get('/auth/facebook/callback', [SocialLoginController::class, 'UserHandleFacebookCallback']);
});
