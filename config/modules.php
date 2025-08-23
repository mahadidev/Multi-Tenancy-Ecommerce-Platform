<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Module Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for the modular architecture
    | of the application. You can enable/disable modules and configure
    | their behavior here.
    |
    */

    'enabled' => env('MODULES_ENABLED', true),

    'modules' => [
        'Authentication' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 1,
            'description' => 'Handles user authentication, registration, email verification',
        ],
        'UserManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 2,
            'description' => 'Manages user profiles and accounts',
        ],
        'RoleManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 3,
            'description' => 'Manages roles and permissions for access control',
        ],
        'StoreManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 4,
            'description' => 'Manages stores, themes, menus, and store pages',
        ],
        'ProductManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 5,
            'description' => 'Manages products, categories, brands, and variants',
        ],
        'InventoryManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 6,
            'description' => 'Handles stock tracking, inventory management',
        ],
        'OrderManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 7,
            'description' => 'Manages orders, cart, order processing',
        ],
        'PaymentManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 8,
            'description' => 'Handles payment processing and gateways',
        ],
        'ContentManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 9,
            'description' => 'Manages blogs, pages, widgets, and content',
        ],
        'ThemeManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 10,
            'description' => 'Handles theme management, theme pages, and theme customization',
        ],
        'SubscriptionManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 11,
            'description' => 'Handles subscription plans and billing',
        ],
        'NotificationManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 12,
            'description' => 'Manages notifications, emails, and alerts',
        ],
        'AnalyticsManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 13,
            'description' => 'Provides analytics, reporting, and dashboard data',
        ],
        'FileManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 14,
            'description' => 'Handles file uploads, storage, and media management',
        ],
        'CustomerManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 15,
            'description' => 'Manages customer profiles, registration, and customer relationships',
        ],
        'ContactManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 16,
            'description' => 'Handles contact forms, inquiries, and customer communications',
        ],
        'FinancialManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 17,
            'description' => 'Handles expenses, vendors, and financial tracking',
        ],
        'SettingsManagement' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 18,
            'description' => 'Handles application and store settings management',
        ],
        'WebsiteBuilder' => [
            'enabled' => true,
            'auto_boot' => true,
            'priority' => 19,
            'description' => 'Multi-tenant website builder with drag-and-drop page editor',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Module Paths
    |--------------------------------------------------------------------------
    |
    | Define paths for module structure
    |
    */
    'paths' => [
        'modules' => app_path('Modules'),
        'migrations' => 'Database/Migrations',
        'routes' => 'Routes',
        'views' => 'Resources/Views',
        'lang' => 'Resources/Lang',
        'config' => 'Config',
        'controllers' => 'Controllers',
        'models' => 'Models',
        'services' => 'Services',
        'requests' => 'Requests',
        'resources' => 'Resources',
        'middleware' => 'Middleware',
        'policies' => 'Policies',
        'tests' => 'Tests',
    ],

    /*
    |--------------------------------------------------------------------------
    | Module Caching
    |--------------------------------------------------------------------------
    |
    | Enable caching for better performance in production
    |
    */
    'cache' => [
        'enabled' => env('MODULE_CACHE_ENABLED', false),
        'ttl' => env('MODULE_CACHE_TTL', 3600), // 1 hour
        'store' => env('MODULE_CACHE_STORE', 'file'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Development Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration options for development environment
    |
    */
    'development' => [
        'hot_reload' => env('MODULE_HOT_RELOAD', false),
        'debug_modules' => env('DEBUG_MODULES', false),
        'show_module_info' => env('SHOW_MODULE_INFO', false),
    ],
];