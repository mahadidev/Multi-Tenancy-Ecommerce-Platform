<?php

namespace App\Http\Controllers\Api\v1\site;

use Illuminate\Support\Facades\Route;



Route::group(['middleware' => ['auth:sanctum']], function () {
    // cart route
    Route::post('/add-to-cart', [CartController::class, 'addToCart']);
});
