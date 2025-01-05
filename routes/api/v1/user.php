<?php 

namespace App\Http\Controllers\Api\v1\User;

use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum']], function () {

    Route::get('profile', [ProfileController::class, 'profile']);
    
});