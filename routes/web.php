<?php

use App\Http\Controllers\ThemeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FilamentController;
use App\Http\Controllers\ArtisanController;

Route::get('/', function () {
    return view("welcome");
});
Route::prefix('/seller')->group(function () {

    Route::get("/", function () {
        return view("seller-panel");
    });

    Route::any('/{any}', function () {
        return view("seller-panel");
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
