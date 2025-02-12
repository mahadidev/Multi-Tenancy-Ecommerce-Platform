<?php 

namespace App\Http\Controllers\Api\v1;


use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum', 'verified']], function () {
    
    // Profile Route
    Route::get('profile', [ProfileController::class, 'profile']);

    // Update Profile Info Route
    Route::post('update', [ProfileController::class, 'updateProfile']);

    // Password Change Route
    Route::post('password-change', [ProfileController::class, 'passwordChange']);
});

Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum']], function () {
    // Logout Route
    Route::get('logout', [AuthController::class, 'logout']);
});