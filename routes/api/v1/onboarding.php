<?php 

namespace App\Http\Controllers\Api\v1\OnBoarding;
use Illuminate\Support\Facades\Route;

// Route::group(['prefix' => 'onboarding'], function () {
//     // Register a new seller account
//     Route::post('/seller-account-register', [OnBoardingController::class, 'sellerRegister']);
    
//     // Select an authorized store
//     Route::post('/create-store', [OnBoardingController::class, 'createStore']);
     
//     // Store branding in store table
//     Route::post('/store-branding', [OnBoardingController::class, 'storeBranding']);

//     // Store theme selection in store table
//     Route::post('/theme-selection', OnBoardingController::class, 'themeSelection');
// });

Route::group(['prefix' => 'onboarding'], function () {
    // Register a new seller account
    Route::post('/seller-account-register', [OnBoardingController::class, 'sellerRegister']);
    
    // Select an authorized store
    Route::post('/create-store', [OnBoardingController::class, 'createStore']);
     
    // Store branding in store table
    Route::post('/store-branding', [OnBoardingController::class, 'storeBranding']);

    // Store theme selection in store table
    Route::post('/theme-selection', [OnBoardingController::class, 'themeSelection']);
});











