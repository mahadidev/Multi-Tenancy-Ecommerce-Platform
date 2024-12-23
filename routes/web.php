<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtisanController;

Route::get('/', function () {
    return redirect()->to(url('/admin'));
});

Route::get('/deploy', [ArtisanController::class, 'run'])->name('deploy');