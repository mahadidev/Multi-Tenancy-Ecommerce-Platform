<?php

namespace App\Modules\StoreManagement;

use App\Modules\BaseModule;

class StoreManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'StoreManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Manages stores, store settings, themes, menus, and store pages';
    }

    public function boot(): void
    {
        // Register store middleware
        $this->registerMiddleware();
        
        // Register store policies
        $this->registerPolicies();
    }

    public function register(): void
    {
        // Register module services
        $this->app->singleton('store.service', function () {
            return new Services\StoreService();
        });

        $this->app->singleton('theme.service', function () {
            return new Services\ThemeService();
        });

        $this->app->singleton('menu.service', function () {
            return new Services\MenuService();
        });

        $this->app->singleton('page.service', function () {
            return new Services\PageService();
        });
    }

    protected function registerMiddleware(): void
    {
        // Register store-related middleware
        $router = $this->app['router'];
        $router->aliasMiddleware('store.context', Middleware\StoreContextMiddleware::class);
        $router->aliasMiddleware('store.owner', Middleware\StoreOwnerMiddleware::class);
    }

    protected function registerPolicies(): void
    {
        // Register store management policies
    }

    public function getConfig(): array
    {
        return [
            'store_types' => [
                'basic' => 'Basic Store',
                'premium' => 'Premium Store',
                'enterprise' => 'Enterprise Store',
            ],
            'default_theme' => 'default',
            'max_stores_per_user' => 5,
            'store_features' => [
                'basic' => ['products', 'orders', 'customers'],
                'premium' => ['products', 'orders', 'customers', 'analytics', 'themes'],
                'enterprise' => ['products', 'orders', 'customers', 'analytics', 'themes', 'api', 'multi_user'],
            ],
        ];
    }

    public function getDependencies(): array
    {
        return ['Authentication', 'UserManagement'];
    }
}