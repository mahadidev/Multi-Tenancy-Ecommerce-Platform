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

    // User Account - Forgot Password
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);

    Route::group(['prefix' => 'seller'], function () {
        Route::post('login', [AuthController::class, 'sellerLogin']);
        Route::post('register', [AuthController::class, 'sellerRegister']);
        Route::group(['middleware' => ['auth:sanctum']], function () {
            Route::get('resend-verification-email', [AuthController::class, 'resendVerificationEmail']);
        });
    });

    Route::group(['prefix' => 'user'], function () {
        Route::post('login', [AuthController::class, 'sellerLogin']);
        Route::post('register', [AuthController::class, 'sellerRegister']);
        Route::group(['middleware' => ['auth:sanctum']], function () {
            Route::get('resend-verification-email', [AuthController::class, 'resendVerificationEmail']);
        });
    });

    // User Account - Verify Email
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    
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

    // Google Login Routes
    Route::get('/auth/google', [SocialLoginController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [SocialLoginController::class, 'UserHandleGoogleCallback']);

    // Facebook Login Routes
    Route::get('/auth/facebook', [SocialLoginController::class, 'redirectToFacebook']);
    Route::get('/auth/facebook/callback', [SocialLoginController::class, 'UserHandleFacebookCallback']);

    Route::post('/auth/social-login-check', [SocialLoginController::class, 'socialMediaLogin'])->name('auth.social.login');

    // svg icons routes
    Route::resource('svg-icons', SvgIconController::class);

    // Theme Widgets
    Route::get('widget-types', [WidgetTypeController::class, 'index']);

    // Store Types
    Route::get('store-types', [StoreTypeController::class, 'index']);

    // Widget Routes
    Route::get('widgets/{id?}', [WidgetController::class, 'index']);

});
