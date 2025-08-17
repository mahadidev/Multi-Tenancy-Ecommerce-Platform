<?php 

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum', 'verified']], function () {
    // All user profile routes are now handled by UserManagement module
    // See: app/Modules/UserManagement/Routes/api.php
});

Route::group(['prefix' => 'user', 'middleware' => ['auth:sanctum']], function () {
    // Logout route is now handled by Authentication module
    // See: app/Modules/Authentication/Routes/api.php
});