<?php

use App\Modules\ThemeManagement\Controllers\ThemeController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1'], function () {
    // Theme Routes
    Route::get('themes', [ThemeController::class, 'getThemes']);
    Route::get('themes/{id}', [ThemeController::class, 'getTheme']);
    
    // RESTful theme routes
    Route::resource('themes', ThemeController::class)->only(['index', 'show']);
});