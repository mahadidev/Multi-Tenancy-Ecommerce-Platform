<?php

namespace App\Modules\SubscriptionManagement;

use App\Modules\BaseModule;

class SubscriptionManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'SubscriptionManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Handles subscription plans, billing, and subscription management';
    }

    public function boot(): void
    {
        // Register subscription-specific middleware and policies
    }

    public function register(): void
    {
        $this->app->singleton('subscription.service', function () {
            return new Services\SubscriptionService();
        });
    }

    public function getDependencies(): array
    {
        return ['UserManagement', 'PaymentManagement'];
    }
}