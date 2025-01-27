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
        return view("seller.seller");
    });

    Route::any('/pages/{id}', function () {
        return view("seller.page-editor");
    })->where('any', '.*');

    Route::any('/{any}', function () {
        return view("seller.seller");
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
Route::get('/test', function(){
    // $theme = \App\Models\Theme::with('pages.page_widgets')->first();
    // $data = new \App\Http\Resources\ThemeResource($theme);
    // return $data->pages;

    $theme = \App\Models\Theme::with('pages.page_widgets')->first();
    $themeData = new \App\Http\Resources\ThemeResource($theme);
    return $pages = $themeData->pages;

});
