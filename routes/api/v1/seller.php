<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum']], function () {
    /*
     * MODULAR ROUTES:
     * - Store routes are now handled by StoreManagement module
     * - Product routes are now handled by ProductManagement module
     * - Authentication routes are now handled by Authentication module
     * See respective module Routes/api.php files
     */

    // Routes now handled by respective modules:
    // - Profile routes: UserManagement module
    // - Contact routes: ContactManagement module
    // - Store pages and widgets: ContentManagement module  
    // - Customer routes: CustomerManagement module


    //------------------------------------------------ New module routes ------------------------------------------------

    // Widget Input Type Routes are now handled by ContentManagement module
    // See: app/Modules/ContentManagement/Routes/api.php

});

Route::group(['prefix' => 'seller', 'middleware' => ['auth:sanctum', 'store']], function () {
    /*
     * MODULAR ROUTES:
     * - Product routes are now handled by ProductManagement module
     * - Store routes are now handled by StoreManagement module
     * See respective module Routes/api.php files
     */
    
    // Brand and Category routes now handled by ProductManagement module

    // Product barcode generation route is now handled by ProductManagement module
    // See: app/Modules/ProductManagement/Routes/api.php

    // Product Review routes are now handled by ProductManagement module
    // See: app/Modules/ProductManagement/Routes/api.php

    // Routes now handled by respective modules:
    // - Blog routes: ContentManagement module
    // - Order and cart routes: OrderManagement module

    // All remaining routes are now handled by respective modules:
    // - Store menu routes: StoreManagement module
    // - Store admin and roles: StoreManagement module  
    // - Subscription routes: SubscriptionManagement module
    // - Courier/shipping routes: ShippingManagement module
    // - Store API credentials: StoreManagement module
    // See respective module Routes/api.php files

});

// Empty route group removed - logout route now handled by Authentication module
