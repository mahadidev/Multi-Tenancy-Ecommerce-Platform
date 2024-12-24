<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtisanController;

Route::get('/', function () {
    return redirect()->to(url('/admin'));
});

Route::get('/select-store', [ArtisanController::class, 'store'])->name('seller.store');
Route::get('/deploy', [ArtisanController::class, 'run'])->name('deploy');