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

// Catch any URL with /public/ in the path and return a 404
Route::any('/public/{any}', function () {
    abort(404);  // Show 404 error for any request under /public/
})->where('any', '.*');
