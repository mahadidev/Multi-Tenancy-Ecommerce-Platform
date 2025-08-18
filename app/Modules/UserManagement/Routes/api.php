<?php

use App\Modules\UserManagement\Controllers\UserController;
use App\Modules\UserManagement\Controllers\ProfileController;
use App\Modules\UserManagement\Controllers\StoreAdminController;
// use App\Modules\UserManagement\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->middleware(['auth:sanctum'])->group(function () {
    // User Management Routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/stats', [UserController::class, 'stats']);
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        
        Route::prefix('{user}')->group(function () {
            Route::get('/', [UserController::class, 'show']);
            Route::put('/', [UserController::class, 'update']);
            Route::delete('/', [UserController::class, 'destroy']);
            Route::post('/add-to-store', [UserController::class, 'addToStore']);
            Route::post('/remove-from-store', [UserController::class, 'removeFromStore']);
        });
    });

    // Seller Profile Routes
    Route::prefix('seller')->group(function () {
        Route::get('/profile', [ProfileController::class, 'profile']);
        Route::post('/profile/update', [ProfileController::class, 'updateProfile']);
        Route::post('/profile/password-change', [ProfileController::class, 'passwordChange']);
    });

    // Store Admin Management Routes - Require store user management permission
    Route::prefix('seller')->middleware(['store', 'custom.permission:store.manage_users'])->group(function () {
        Route::prefix('store-admin')->controller(StoreAdminController::class)->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/{admin}', 'show');
            Route::put('/{admin}', 'update');
            Route::delete('/{admin}', 'destroy');
        });
    });

    // Role & Permission Management Routes - TODO: Create RoleController
    // Route::prefix('roles')->group(function () {
    //     Route::get('/', [RoleController::class, 'index']);
    //     Route::post('/', [RoleController::class, 'store']);
    //     Route::get('/{role}', [RoleController::class, 'show']);
    //     Route::put('/{role}', [RoleController::class, 'update']);
    //     Route::delete('/{role}', [RoleController::class, 'destroy']);
    //     Route::post('/{role}/permissions', [RoleController::class, 'syncPermissions']);
    // });
});