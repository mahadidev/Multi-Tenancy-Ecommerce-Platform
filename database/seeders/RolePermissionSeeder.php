<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define roles
        $roles = [
            'super-admin'=>[
                'view_dashboard',
            ],
            'admin' => [
                // Dashboard and general permissions
                'view_dashboard',
            ],
            'user' => [
                // Dashboard and general permissions
                'view_dashboard',

                // Product-related permissions
                'view_product',
            ],
            'seller' => [
                // Dashboard and general permissions
                'view_dashboard',

                // e-commerce permissions
                'view_category',
                'create_category',
                'edit_category',
                'delete_category',

                // Brand-related permissions
                'view_brand',
                'create_brand',
                'edit_brand',
                'delete_brand',

                // product-related permissions
                'view_product',
                'create_product',
                'edit_product',
                'delete_product',

                // Order-related permissions
                'view_order',
                'edit_order',
                'delete_order',
                'create_order',

                // Customer-related permissions
                'view_customer',
                'edit_customer',
                'delete_customer',
                'create_customer',

                // Store-related permissions
                'view_store',
                'edit_store',
                'delete_store',
                'create_store',

                // Store Page permissions
                'view_store_page',
                'edit_store_page',
                'delete_store_page',
                'create_store_page',

                // Store Page Widget permissions
                'view_store_page_widget',
                'edit_store_page_widget',
                'delete_store_page_widget',
                'create_store_page_widget',
                
                // Store Page Widget Input permissions
                'view_store_page_widget_input',
                'edit_store_page_widget_input',
                'delete_store_page_widget_input',
                'create_store_page_widget_input',

                // Store Page Widget Input Item permissions
                'view_store_page_widget_input_item',
                'edit_store_page_widget_input_item',
                'delete_store_page_widget_input_item',
                'create_store_page_widget_input_item',

                // Store Blog permissions
                'view_store_blog',
                'edit_store_blog',
                'delete_store_blog',
                'create_store_blog',

                // Store Blog Category permissions
                'view_store_blog_category',
                'edit_store_blog_category',
                'delete_store_blog_category',
                'create_store_blog_category',

                // Store Menu permissions
                'view_store_menu',
                'edit_store_menu',
                'delete_store_menu',
                'create_store_menu',

                // Store Admin permissions
                'view_store_admin',
                'edit_store_admin',
                'delete_store_admin',
                'create_store_admin',

                // Store Access Management permissions
                'view_store_access_management',
                'edit_store_access_management',
                'delete_store_access_management',
                'create_store_access_management',

            ],
        ];

        // Loop through each role
        foreach ($roles as $roleName => $rolePermissions) {
            // Check if the role already exists
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => ''],
                [
                    'name' => $roleName,
                    'slug' => Str::slug($roleName) . '-empty',
                    'guard_name' => '',
                ]
            );

            // Assign permissions to the role
            foreach ($rolePermissions as $permissionName) {
                $permission = Permission::firstOrCreate(['name' => $permissionName]);
                $role->givePermissionTo($permission);
            }
        }
    }
}
