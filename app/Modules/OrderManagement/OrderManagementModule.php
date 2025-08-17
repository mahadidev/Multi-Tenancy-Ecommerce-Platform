<?php

namespace App\Modules\OrderManagement;

use App\Modules\BaseModule;

class OrderManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'OrderManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Manages orders, cart, order processing, and order-related functionality';
    }

    public function boot(): void
    {
        // Register order-specific middleware and policies
    }

    public function register(): void
    {
        // Register module services
        $this->app->singleton('order.service', function () {
            return new Services\OrderService();
        });

        $this->app->singleton('cart.service', function () {
            return new Services\CartService();
        });

        $this->app->singleton('order.processor.service', function () {
            return new Services\OrderProcessorService();
        });
    }

    public function getConfig(): array
    {
        return [
            'order_statuses' => [
                'pending' => 'Pending',
                'processing' => 'Processing', 
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled',
                'refunded' => 'Refunded',
            ],
            'auto_approve_orders' => false,
            'send_order_notifications' => true,
        ];
    }

    public function getDependencies(): array
    {
        return ['ProductManagement', 'UserManagement', 'PaymentManagement'];
    }
}