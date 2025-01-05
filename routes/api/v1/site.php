<?php 

namespace App\Http\Controllers\Api\v1;
use Illuminate\Support\Facades\Route;


// cart route
Route::post('/add-to-cart', [CartController::class, 'addToCart']);




