<?php

namespace App\Modules\InventoryManagement;

use App\Modules\BaseModule;

class InventoryManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'InventoryManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Handles stock tracking, inventory management, and stock history';
    }

    public function boot(): void
    {
        // Register inventory-specific middleware and policies
    }

    public function register(): void
    {
        // Register module services
        $this->app->singleton('inventory.service', function () {
            return new Services\InventoryService();
        });

        $this->app->singleton('stock.service', function () {
            return new Services\StockService();
        });

        $this->app->singleton('stock.history.service', function () {
            return new Services\StockHistoryService();
        });
    }

    public function getConfig(): array
    {
        return [
            'track_stock' => true,
            'low_stock_threshold' => 10,
            'enable_stock_alerts' => true,
            'allow_backorders' => false,
            'stock_adjustment_reasons' => [
                'sale' => 'Sale',
                'return' => 'Return',
                'adjustment' => 'Manual Adjustment',
                'damage' => 'Damaged',
                'theft' => 'Theft',
            ],
        ];
    }

    public function getDependencies(): array
    {
        return ['ProductManagement'];
    }
}