<?php

use App\Modules\SettingsManagement\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

// Settings routes - require authentication and store access
Route::prefix('settings')
    ->middleware(['auth:sanctum', 'store'])
    ->controller(SettingsController::class)
    ->group(function () {
        
        // General Settings
        Route::get('/general', 'getGeneralSettings');
        Route::put('/general', 'updateGeneralSettings');
        
        // Profile Settings
        Route::get('/profile', 'getProfileSettings');
        Route::put('/profile', 'updateProfileSettings');
        
        // Social Media Settings
        Route::get('/social-media', 'getSocialMediaSettings');
        Route::put('/social-media', 'updateSocialMediaSettings');
        
        // Password Management
        Route::put('/change-password', 'changePassword');
        
        // File Uploads
        Route::post('/upload-avatar', 'uploadAvatar');
        Route::post('/upload-logo', 'uploadLogo');
        
        // Reset Settings
        Route::post('/reset', 'resetSettings');
    });