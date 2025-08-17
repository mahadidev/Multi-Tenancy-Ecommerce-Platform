<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:sanctum' , 'verified']], function () {
    // All routes in this group are now handled by respective modules:
    // - Cart routes: OrderManagement module
    // - Order routes: OrderManagement module  
    // - Product review routes: ProductManagement module
    // See respective module Routes/api.php files
});


// All public routes are now handled by respective modules:
// - Store routes: StoreManagement module
// - Product and category routes: ProductManagement module
// - Contact routes: ContactManagement module
// - Order routes: OrderManagement module
// See respective module Routes/api.php files
