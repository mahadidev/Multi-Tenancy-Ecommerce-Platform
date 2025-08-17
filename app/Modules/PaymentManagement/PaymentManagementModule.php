<?php

namespace App\Modules\PaymentManagement;

use App\Modules\BaseModule;

class PaymentManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'PaymentManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Handles payment processing, gateways, and transaction management';
    }

    public function boot(): void
    {
        // Register payment-specific middleware and policies
    }

    public function register(): void
    {
        $this->app->singleton('payment.service', function () {
            return new Services\PaymentService();
        });
    }

    public function getDependencies(): array
    {
        return ['OrderManagement'];
    }
}