<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Store Management
            [
                'name' => 'View Store',
                'slug' => 'store.view',
                'description' => 'Can view store details and information',
                'group' => 'Store Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manage Store',
                'slug' => 'store.manage',
                'description' => 'Can edit store settings, themes, and configurations',
                'group' => 'Store Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manage Users',
                'slug' => 'store.manage_users',
                'description' => 'Can manage store users, roles, and permissions',
                'group' => 'Store Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Product Management
            [
                'name' => 'View Products',
                'slug' => 'products.view',
                'description' => 'Can view products and product details',
                'group' => 'Product Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Create Products',
                'slug' => 'products.create',
                'description' => 'Can create new products',
                'group' => 'Product Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Edit Products',
                'slug' => 'products.edit',
                'description' => 'Can edit existing products',
                'group' => 'Product Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Delete Products',
                'slug' => 'products.delete',
                'description' => 'Can delete products',
                'group' => 'Product Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Order Management
            [
                'name' => 'View Orders',
                'slug' => 'orders.view',
                'description' => 'Can view orders and order details',
                'group' => 'Order Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Process Orders',
                'slug' => 'orders.process',
                'description' => 'Can process orders, update status, and manage fulfillment',
                'group' => 'Order Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cancel Orders',
                'slug' => 'orders.cancel',
                'description' => 'Can cancel orders and process refunds',
                'group' => 'Order Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Analytics & Reports
            [
                'name' => 'View Analytics',
                'slug' => 'analytics.view',
                'description' => 'Can view store analytics and reports',
                'group' => 'Analytics & Reports',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Export Reports',
                'slug' => 'analytics.export',
                'description' => 'Can export analytics data and reports',
                'group' => 'Analytics & Reports',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Customer Management
            [
                'name' => 'View Customers',
                'slug' => 'customers.view',
                'description' => 'Can view customer profiles and information',
                'group' => 'Customer Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manage Customers',
                'slug' => 'customers.manage',
                'description' => 'Can edit customer information and manage accounts',
                'group' => 'Customer Management',
                'guard_name' => 'web',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($permissions as $permission) {
            // Check if permission already exists
            $exists = DB::table('permissions')
                ->where('slug', $permission['slug'])
                ->exists();
            
            if (!$exists) {
                DB::table('permissions')->insert($permission);
            }
        }
    }
}