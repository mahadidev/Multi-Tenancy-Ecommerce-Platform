<?php

use App\Http\Controllers\ThemeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FilamentController;
use App\Http\Controllers\ArtisanController;
use App\Http\Controllers\Api\v1\site\OrderController;

Route::get('/', function () {
    return view("welcome");
});
Route::prefix('/seller')->group(function () {

    Route::get("/", function () {
        return view("seller");
    });

    Route::any('/{any}', function () {
        return view("seller");
    })->where('any', '.*');
});


Route::prefix("/themes")->group(function () {
    Route::get("/{slug}", [ThemeController::class, "show"]);
});


Route::prefix('/themes')->group(function () {

    Route::prefix("/{slug}")->group(function () {
        Route::get("/{any}", [ThemeController::class, "show"])->where('any', '.*');
        ;
    });

});


//test
Route::get('/test', [OrderController::class, 'test']);
