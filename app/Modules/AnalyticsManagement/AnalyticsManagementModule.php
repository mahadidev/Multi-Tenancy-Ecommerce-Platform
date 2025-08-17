<?php

namespace App\Modules\AnalyticsManagement;

use App\Modules\BaseModule;

class AnalyticsManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'AnalyticsManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Provides analytics, reporting, and dashboard data';
    }

    public function boot(): void
    {
        // Register analytics-specific middleware and policies
    }

    public function register(): void
    {
        $this->app->singleton('analytics.service', function () {
            return new Services\AnalyticsService();
        });
    }

    public function getDependencies(): array
    {
        return ['OrderManagement', 'ProductManagement', 'UserManagement'];
    }
}