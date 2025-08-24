<?php

namespace App\Modules\CustomerManagement\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\CustomerManagement\Services\CustomerProfileService;

class CustomerManagementServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register CustomerProfileService as singleton
        $this->app->singleton(CustomerProfileService::class, function ($app) {
            return new CustomerProfileService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load module migrations
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');

        // Load module routes
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}