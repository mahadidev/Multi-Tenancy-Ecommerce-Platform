<?php

use App\Modules\NotificationManagement\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->middleware(['auth:sanctum'])->group(function () {
    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/{id}', [NotificationController::class, 'view']);
    Route::get('notifications/mark/all-read', [NotificationController::class, 'markAllAsRead']);
});