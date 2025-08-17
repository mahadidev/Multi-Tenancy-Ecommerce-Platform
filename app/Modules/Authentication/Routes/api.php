<?php

use App\Modules\Authentication\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->middleware('web')->group(function () {
    // Seller Authentication Routes
    Route::prefix('seller')->group(function () {
        Route::post('/login', [AuthController::class, 'sellerLogin']);
        Route::post('/register', [AuthController::class, 'sellerRegister']);
    });

    // User Authentication Routes
    Route::prefix('user')->group(function () {
        Route::post('/login', [AuthController::class, 'userLogin']);
        Route::post('/register', [AuthController::class, 'userRegister']);
    });

    // Common Authentication Routes
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('/resend-verification-email', [AuthController::class, 'resendVerificationEmail'])
        ->middleware('auth:sanctum');
});