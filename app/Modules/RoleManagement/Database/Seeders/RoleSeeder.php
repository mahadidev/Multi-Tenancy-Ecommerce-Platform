<?php

namespace App\Modules\RoleManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\RoleManagement\Models\Role;
use App\Modules\RoleManagement\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Global roles (not store-specific)
        $globalRoles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Full system access with all permissions',
                'store_id' => null,
                'is_default' => false,
                'permissions' => [], // Will get all permissions
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Administrative access to the system',
                'store_id' => null,
                'is_default' => false,
                'permissions' => [], // Will get most permissions
            ],
        ];

        // Store-specific default roles
        $storeRoles = [
            [
                'name' => 'Store Owner',
                'slug' => 'store-owner',
                'description' => 'Full access to store management',
                'is_default' => true,
                'permissions' => [
                    'settings.view', 'settings.edit',
                    'store.view_users', 'store.create_users', 'store.edit_users', 'store.delete_users',
                    'products.view', 'products.create', 'products.edit', 'products.delete', 'products.manage_stock',
                    'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
                    'orders.view', 'orders.create', 'orders.edit', 'orders.delete', 'orders.refund',
                    'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
                    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
                    'vendors.view', 'vendors.create', 'vendors.edit', 'vendors.delete', 'reports.financial',
                    'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign',
                    'permissions.view', 'permissions.edit',
                    'analytics.view', 'reports.export',
                    'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
                    'menus.view', 'menus.create', 'menus.edit', 'menus.delete',
                    'pages.view', 'pages.create', 'pages.edit', 'pages.delete',
                    'settings.view', 'settings.edit',
                ],
            ],
            [
                'name' => 'Store Manager',
                'slug' => 'store-manager',
                'description' => 'Manage day-to-day store operations',
                'is_default' => false,
                'permissions' => [
                    'settings.view',
                    'store.view_users', 'store.edit_users',
                    'products.view', 'products.create', 'products.edit', 'products.manage_stock',
                    'categories.view', 'categories.create', 'categories.edit',
                    'orders.view', 'orders.create', 'orders.edit',
                    'customers.view', 'customers.create', 'customers.edit',
                    'expenses.view', 'expenses.create', 'expenses.edit',
                    'vendors.view', 'vendors.create', 'vendors.edit',
                    'analytics.view',
                    'blogs.view', 'blogs.create', 'blogs.edit',
                    'menus.view', 'menus.create', 'menus.edit',
                    'pages.view', 'pages.create', 'pages.edit',
                ],
            ],
            [
                'name' => 'Store Staff',
                'slug' => 'store-staff',
                'description' => 'Basic store operations and order processing',
                'is_default' => false,
                'permissions' => [
                    'settings.view',
                    'products.view', 'products.manage_stock',
                    'categories.view',
                    'orders.view', 'orders.edit',
                    'customers.view',
                    'expenses.view', 'expenses.create',
                ],
            ],
            [
                'name' => 'Accountant',
                'slug' => 'accountant',
                'description' => 'Financial management and reporting',
                'is_default' => false,
                'permissions' => [
                    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
                    'vendors.view', 'vendors.create', 'vendors.edit', 'vendors.delete', 'reports.financial',
                    'analytics.view', 'reports.export',
                    'orders.view',
                ],
            ],
            [
                'name' => 'Content Manager',
                'slug' => 'content-manager',
                'description' => 'Manage store content and pages',
                'is_default' => false,
                'permissions' => [
                    'settings.view',
                    'products.view', 'products.create', 'products.edit',
                    'categories.view', 'categories.create', 'categories.edit',
                    'blogs.view', 'blogs.create', 'blogs.edit', 'blogs.delete',
                    'menus.view', 'menus.create', 'menus.edit', 'menus.delete',
                    'pages.view', 'pages.create', 'pages.edit', 'pages.delete',
                ],
            ],
        ];

        // Create global roles
        foreach ($globalRoles as $roleData) {
            $role = Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );

            if ($roleData['slug'] === 'super-admin') {
                // Super admin gets all permissions
                $allPermissions = Permission::active()->get();
                $role->syncPermissions($allPermissions->pluck('id')->toArray());
            } elseif ($roleData['slug'] === 'admin') {
                // Admin gets most permissions except user management
                $permissions = Permission::active()
                    ->whereNotIn('slug', ['roles.manage', 'roles.assign', 'permissions.manage'])
                    ->get();
                $role->syncPermissions($permissions->pluck('id')->toArray());
            }
        }

        // Note: Store-specific roles will be created when stores are created
        // For now, we'll create templates that can be copied per store
        foreach ($storeRoles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);
            
            // Create role template (will be copied for each store)
            $roleData['slug'] = 'template-' . $roleData['slug'];
            $roleData['name'] = 'Template: ' . $roleData['name'];
            $roleData['store_id'] = null; // Template roles have no store
            
            $role = Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );

            // Assign permissions to template role
            $permissionIds = Permission::whereIn('slug', $permissions)->pluck('id')->toArray();
            $role->syncPermissions($permissionIds);
        }
    }
}