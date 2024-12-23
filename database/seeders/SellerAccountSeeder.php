<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class SellerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the 'store-owner' role exists
        $role = Role::firstOrCreate(['name' => 'seller']);

        $store = Store::get();

        if ($store->count() <= 0) {

            // Create 10 users with unique emails and the 'store-owner' role
            for ($i = 1; $i <= 10; $i++) {
                
                $user = User::create([
                    'name' => "Store Owner $i",
                    'email' => "store$i@example.com",
                    'password' => Hash::make('password'), // Default password
                ]);

                // Assign the 'store-owner' role to the user
                $user->assignRole($role);
            }
        } 

        
    }
}
