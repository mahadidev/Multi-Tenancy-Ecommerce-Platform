<?php

namespace App\Modules\RoleManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\RoleManagement\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Settings
            [
                'name' => 'View Settings',
                'slug' => 'settings.view',
                'description' => 'View store settings and system configuration',
                'group' => 'settings',
            ],
            [
                'name' => 'Edit Settings',
                'slug' => 'settings.edit',
                'description' => 'Edit store settings and system configuration',
                'group' => 'settings',
            ],
            [
                'name' => 'View Store Users',
                'slug' => 'store.view_users',
                'description' => 'View store users and their roles',
                'group' => 'user_management',
            ],
            [
                'name' => 'Create Store Users',
                'slug' => 'store.create_users',
                'description' => 'Add new users to the store',
                'group' => 'user_management',
            ],
            [
                'name' => 'Edit Store Users',
                'slug' => 'store.edit_users',
                'description' => 'Edit existing store users',
                'group' => 'user_management',
            ],
            [
                'name' => 'Delete Store Users',
                'slug' => 'store.delete_users',
                'description' => 'Remove users from the store',
                'group' => 'user_management',
            ],

            // Product Management
            [
                'name' => 'View Products',
                'slug' => 'products.view',
                'description' => 'View product listings',
                'group' => 'product_management',
            ],
            [
                'name' => 'Create Products',
                'slug' => 'products.create',
                'description' => 'Create new products',
                'group' => 'product_management',
            ],
            [
                'name' => 'Edit Products',
                'slug' => 'products.edit',
                'description' => 'Edit existing products',
                'group' => 'product_management',
            ],
            [
                'name' => 'Delete Products',
                'slug' => 'products.delete',
                'description' => 'Delete products',
                'group' => 'product_management',
            ],
            [
                'name' => 'Manage Stock',
                'slug' => 'products.manage_stock',
                'description' => 'Manage product stock and inventory',
                'group' => 'product_management',
            ],

            // Category Management
            [
                'name' => 'View Categories',
                'slug' => 'categories.view',
                'description' => 'View product categories',
                'group' => 'category_management',
            ],
            [
                'name' => 'Create Categories',
                'slug' => 'categories.create',
                'description' => 'Create new categories',
                'group' => 'category_management',
            ],
            [
                'name' => 'Edit Categories',
                'slug' => 'categories.edit',
                'description' => 'Edit existing categories',
                'group' => 'category_management',
            ],
            [
                'name' => 'Delete Categories',
                'slug' => 'categories.delete',
                'description' => 'Delete categories',
                'group' => 'category_management',
            ],

            // Order Management
            [
                'name' => 'View Orders',
                'slug' => 'orders.view',
                'description' => 'View order listings',
                'group' => 'order_management',
            ],
            [
                'name' => 'Create Orders',
                'slug' => 'orders.create',
                'description' => 'Create new orders',
                'group' => 'order_management',
            ],
            [
                'name' => 'Edit Orders',
                'slug' => 'orders.edit',
                'description' => 'Edit and update order details',
                'group' => 'order_management',
            ],
            [
                'name' => 'Delete Orders',
                'slug' => 'orders.delete',
                'description' => 'Delete orders',
                'group' => 'order_management',
            ],
            [
                'name' => 'Refund Orders',
                'slug' => 'orders.refund',
                'description' => 'Process order refunds',
                'group' => 'order_management',
            ],

            // Customer Management
            [
                'name' => 'View Customers',
                'slug' => 'customers.view',
                'description' => 'View customer information',
                'group' => 'customer_management',
            ],
            [
                'name' => 'Create Customers',
                'slug' => 'customers.create',
                'description' => 'Create new customer accounts',
                'group' => 'customer_management',
            ],
            [
                'name' => 'Edit Customers',
                'slug' => 'customers.edit',
                'description' => 'Edit existing customer accounts',
                'group' => 'customer_management',
            ],
            [
                'name' => 'Delete Customers',
                'slug' => 'customers.delete',
                'description' => 'Delete customer accounts',
                'group' => 'customer_management',
            ],

            // Financial Management
            [
                'name' => 'View Expenses',
                'slug' => 'expenses.view',
                'description' => 'View expense records',
                'group' => 'financial_management',
            ],
            [
                'name' => 'Create Expenses',
                'slug' => 'expenses.create',
                'description' => 'Create new expense records',
                'group' => 'financial_management',
            ],
            [
                'name' => 'Edit Expenses',
                'slug' => 'expenses.edit',
                'description' => 'Edit existing expense records',
                'group' => 'financial_management',
            ],
            [
                'name' => 'Delete Expenses',
                'slug' => 'expenses.delete',
                'description' => 'Delete expense records',
                'group' => 'financial_management',
            ],
            [
                'name' => 'View Vendors',
                'slug' => 'vendors.view',
                'description' => 'View vendor information',
                'group' => 'vendor_management',
            ],
            [
                'name' => 'Create Vendors',
                'slug' => 'vendors.create',
                'description' => 'Create new vendors',
                'group' => 'vendor_management',
            ],
            [
                'name' => 'Edit Vendors',
                'slug' => 'vendors.edit',
                'description' => 'Edit existing vendors',
                'group' => 'vendor_management',
            ],
            [
                'name' => 'Delete Vendors',
                'slug' => 'vendors.delete',
                'description' => 'Delete vendors',
                'group' => 'vendor_management',
            ],
            [
                'name' => 'View Financial Reports',
                'slug' => 'reports.financial',
                'description' => 'View financial reports and analytics',
                'group' => 'financial_management',
            ],

            // Role & Permission Management
            [
                'name' => 'View Roles',
                'slug' => 'roles.view',
                'description' => 'View roles and permissions',
                'group' => 'role_management',
            ],
            [
                'name' => 'Create Roles',
                'slug' => 'roles.create',
                'description' => 'Create new roles',
                'group' => 'role_management',
            ],
            [
                'name' => 'Edit Roles',
                'slug' => 'roles.edit',
                'description' => 'Edit existing roles',
                'group' => 'role_management',
            ],
            [
                'name' => 'Delete Roles',
                'slug' => 'roles.delete',
                'description' => 'Delete roles',
                'group' => 'role_management',
            ],
            [
                'name' => 'Assign Roles',
                'slug' => 'roles.assign',
                'description' => 'Assign roles to users',
                'group' => 'role_management',
            ],
            [
                'name' => 'View Permissions',
                'slug' => 'permissions.view',
                'description' => 'View available permissions',
                'group' => 'permission_management',
            ],
            [
                'name' => 'Edit Permissions',
                'slug' => 'permissions.edit',
                'description' => 'Edit role permissions assignments',
                'group' => 'permission_management',
            ],

            // Analytics & Reports
            [
                'name' => 'View Analytics',
                'slug' => 'analytics.view',
                'description' => 'View store analytics and insights',
                'group' => 'analytics',
            ],
            [
                'name' => 'Export Reports',
                'slug' => 'reports.export',
                'description' => 'Export various reports',
                'group' => 'analytics',
            ],

            // Blog Management
            [
                'name' => 'View Blogs',
                'slug' => 'blogs.view',
                'description' => 'View blog posts',
                'group' => 'blog_management',
            ],
            [
                'name' => 'Create Blogs',
                'slug' => 'blogs.create',
                'description' => 'Create new blog posts',
                'group' => 'blog_management',
            ],
            [
                'name' => 'Edit Blogs',
                'slug' => 'blogs.edit',
                'description' => 'Edit existing blog posts',
                'group' => 'blog_management',
            ],
            [
                'name' => 'Delete Blogs',
                'slug' => 'blogs.delete',
                'description' => 'Delete blog posts',
                'group' => 'blog_management',
            ],

            // Menu Management
            [
                'name' => 'View Menus',
                'slug' => 'menus.view',
                'description' => 'View store menus',
                'group' => 'menu_management',
            ],
            [
                'name' => 'Create Menus',
                'slug' => 'menus.create',
                'description' => 'Create new menus',
                'group' => 'menu_management',
            ],
            [
                'name' => 'Edit Menus',
                'slug' => 'menus.edit',
                'description' => 'Edit existing menus',
                'group' => 'menu_management',
            ],
            [
                'name' => 'Delete Menus',
                'slug' => 'menus.delete',
                'description' => 'Delete menus',
                'group' => 'menu_management',
            ],

            // Page Management
            [
                'name' => 'View Pages',
                'slug' => 'pages.view',
                'description' => 'View store pages',
                'group' => 'page_management',
            ],
            [
                'name' => 'Create Pages',
                'slug' => 'pages.create',
                'description' => 'Create new pages',
                'group' => 'page_management',
            ],
            [
                'name' => 'Edit Pages',
                'slug' => 'pages.edit',
                'description' => 'Edit existing pages',
                'group' => 'page_management',
            ],
            [
                'name' => 'Delete Pages',
                'slug' => 'pages.delete',
                'description' => 'Delete pages',
                'group' => 'page_management',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }
    }
}