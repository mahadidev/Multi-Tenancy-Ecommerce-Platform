<?php

use App\Modules\ContactManagement\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum']], function () {
    // Contact Routes
    Route::resource('/contact', ContactController::class);
});