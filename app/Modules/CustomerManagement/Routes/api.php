<?php

use App\Modules\CustomerManagement\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api/v1/seller', 'middleware' => ['auth:sanctum']], function () {
    // Customer routes
    Route::resource('customers', CustomerController::class);
    Route::get('customers/generate/pdf', [CustomerController::class, 'pdf']);
    Route::get('customers/generate/excel', [CustomerController::class, 'excel']);
});