<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FilamentController;
use App\Http\Controllers\ArtisanController;

Route::get('/', function () {
    return view("welcome");
});
Route::get('/login', function () {
    return view("app");
});

Route::get('/deploy', [ArtisanController::class, 'run'])->name('deploy');
Route::get('/select-store', [FilamentController::class, 'store'])->name('seller.store')->middleware('auth');
Route::post('/select-store/switch', [FilamentController::class, 'storeSwitch'])->name('seller.store.switch')->middleware('auth');
