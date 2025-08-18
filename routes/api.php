<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {

    // Include the seller routes
    require __DIR__ . '/api/v1/seller.php';

    // Include the site routes
    require __DIR__ . '/api/v1/site.php';

    // Include the site routes
    require __DIR__ . '/api/v1/user.php';

    // Include the onboarding routes
    require __DIR__ . '/api/v1/onboarding.php';

    // Include role management routes
    require app_path('Modules/RoleManagement/Routes/api.php');

    // Authentication routes are now handled by Authentication module
    // See: app/Modules/Authentication/Routes/api.php

    // Theme routes are now handled by ThemeManagement module
    // See: app/Modules/ThemeManagement/Routes/api.php

    // Routes now handled by respective modules:
    // - Page types, SVG icons, widget types, widgets: ContentManagement module
    // - Store types: StoreManagement module  
    // - Notifications: NotificationManagement module
    // - File storage: FileManagement module

    // Social login and subscription routes are now handled by respective modules:
    // - Social login routes: Authentication module
    // - Subscription routes: SubscriptionManagement module
    // See respective module Routes/api.php files
});
