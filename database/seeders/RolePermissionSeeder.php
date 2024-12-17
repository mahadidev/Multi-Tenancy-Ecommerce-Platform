<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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
                'super_access'
            ],
            'admin' => [
                // Dashboard and general permissions
                'view_dashboard',

                // User management permissions
                'edit_user',
                'delete_user',
                'create_user',

                // Vendor management permissions
                'view_vendor',
                'edit_vendor',
                'delete_vendor',
                'create_vendor',

                // Company management permissions
                'view_company',
                'edit_company',
                'delete_company',
                'create_company',

                // Product management permissions
                'view_product',
                'edit_product',
                'delete_product',
                'create_product',
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

                // Vendor-related permissions
                'view_vendor',
                'edit_vendor',
                'create_vendor',

                // Product-related permissions
                'view_product',
                'create_product',
            ],
        ];

        // Loop through each role
        foreach ($roles as $roleName => $rolePermissions) {
            // Check if the role already exists
            $role = Role::firstOrCreate(['name' => $roleName]);

            // Assign permissions to the role
            foreach ($rolePermissions as $permissionName) {
                $permission = Permission::firstOrCreate(['name' => $permissionName]);
                $role->givePermissionTo($permission);
            }
        }
    }
}
