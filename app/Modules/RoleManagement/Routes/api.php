<?php

use Illuminate\Support\Facades\Route;
use App\Modules\RoleManagement\Controllers\PermissionController;
use App\Modules\RoleManagement\Controllers\RoleController;
use App\Modules\RoleManagement\Controllers\UserRoleController;

// Basic permissions endpoint for role creation - accessible to store owners
Route::prefix('seller')->middleware(['auth:sanctum', 'store'])->group(function () {
    Route::get('/permissions', [PermissionController::class, 'index']);
});

Route::prefix('seller')->middleware(['auth:sanctum', 'store', 'custom.permission:store.manage_users'])->group(function () {
    
    // Permission routes - Only admins can manage permissions
    Route::prefix('permissions')->controller(PermissionController::class)->group(function () {
        Route::get('/grouped', 'grouped');
        Route::post('/', 'store');
        Route::get('/group/{group}', 'byGroup');
        Route::get('/{permission}', 'show');
        Route::put('/{permission}', 'update');
        Route::delete('/{permission}', 'destroy');
    });

    // Role routes - Only admins can manage roles
    Route::prefix('roles')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{role}', 'show');
        Route::put('/{role}', 'update');
        Route::delete('/{role}', 'destroy');
        Route::post('/clone-template', 'cloneTemplate');
    });

    // User role assignment routes - Only admins can assign roles
    Route::prefix('user-roles')->controller(UserRoleController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/assign', 'assignRole');
        Route::post('/revoke', 'revokeRole');
        Route::get('/user/{user}', 'userRoles');
        Route::put('/user/{user}', 'updateUserRoles');
    });

    // Store-roles alias (for backward compatibility)
    Route::prefix('store-roles')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{role}', 'show');
        Route::put('/{role}', 'update');
        Route::delete('/{role}', 'destroy');
        Route::post('/clone-template', 'cloneTemplate');
    });

    // Permission assignment routes - Only admins can assign permissions
    Route::post('/store-assign-role-permissions', [RoleController::class, 'assignPermissions']);
    Route::post('/store-revoke-all-permissions', [RoleController::class, 'revokeAllPermissions']);
});

// Global admin routes (for super admin and admin)
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    
    // Global permission management
    Route::prefix('permissions')->controller(PermissionController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{permission}', 'show');
        Route::put('/{permission}', 'update');
        Route::delete('/{permission}', 'destroy');
    });

    // Global role management
    Route::prefix('roles')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{role}', 'show');
        Route::put('/{role}', 'update');
        Route::delete('/{role}', 'destroy');
    });
});