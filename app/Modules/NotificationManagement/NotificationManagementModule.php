<?php

namespace App\Modules\NotificationManagement;

use App\Modules\BaseModule;

class NotificationManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'NotificationManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Manages notifications, emails, alerts, and communication';
    }

    public function boot(): void
    {
        // Register notification-specific middleware and policies
    }

    public function register(): void
    {
        $this->app->singleton('notification.service', function () {
            return new Services\NotificationService();
        });
    }

    public function getDependencies(): array
    {
        return ['UserManagement'];
    }
}