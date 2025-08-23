<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Full system access with all permissions',
                'guard_name' => 'web',
                'store_id' => null, // Global role
                'is_default' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Store Owner',
                'slug' => 'store-owner',
                'description' => 'Store owner with full store management permissions',
                'guard_name' => 'web',
                'store_id' => null, // Global template
                'is_default' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Store Manager',
                'slug' => 'store-manager',
                'description' => 'Can manage store operations, products, and orders',
                'guard_name' => 'web',
                'store_id' => null, // Global template
                'is_default' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Store Staff',
                'slug' => 'store-staff',
                'description' => 'Can view and process orders, manage basic operations',
                'guard_name' => 'web',
                'store_id' => null, // Global template
                'is_default' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Customer',
                'slug' => 'customer',
                'description' => 'Regular customer with shopping permissions',
                'guard_name' => 'web',
                'store_id' => null, // Global role
                'is_default' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($roles as $role) {
            // Check if role already exists
            $exists = DB::table('roles')
                ->where('slug', $role['slug'])
                ->exists();
            
            if (!$exists) {
                DB::table('roles')->insert($role);
            }
        }
    }
}