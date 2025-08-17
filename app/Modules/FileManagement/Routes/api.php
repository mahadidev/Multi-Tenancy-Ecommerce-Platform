<?php

use App\Modules\FileManagement\Controllers\FileStorageController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->middleware(['auth:sanctum'])->group(function () {
    // File storage routes
    Route::post("file-storage/update/{id}", [FileStorageController::class, "update"]);
    Route::resource('file-storage', FileStorageController::class);
});