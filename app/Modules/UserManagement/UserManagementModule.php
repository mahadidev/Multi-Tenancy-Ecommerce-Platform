<?php

namespace App\Modules\UserManagement;

use App\Modules\BaseModule;

class UserManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'UserManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Manages user profiles, roles, permissions, and store administration';
    }

    public function boot(): void
    {
        // Register module-specific policies
        $this->registerPolicies();
    }

    public function register(): void
    {
        // Register module services
        $this->app->singleton('user.service', function () {
            return new Services\UserService();
        });

        $this->app->singleton('role.service', function () {
            return new Services\RoleService();
        });

        $this->app->singleton('permission.service', function () {
            return new Services\PermissionService();
        });
    }

    protected function registerPolicies(): void
    {
        // Register user management policies
    }

    public function getConfig(): array
    {
        return [
            'roles' => [
                'admin' => 'System Administrator',
                'seller' => 'Store Owner',
                'store_admin' => 'Store Administrator',
                'user' => 'Customer',
            ],
            'default_permissions' => [
                'admin' => ['*'],
                'seller' => ['manage_store', 'manage_products', 'manage_orders'],
                'store_admin' => ['manage_products', 'manage_orders', 'view_analytics'],
                'user' => ['place_orders', 'view_profile'],
            ],
        ];
    }

    public function getDependencies(): array
    {
        return ['Authentication'];
    }
}