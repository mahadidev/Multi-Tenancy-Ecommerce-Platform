<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Check if the 'admin' role already exists, if not, create it
        $admin = Role::firstOrCreate(['name' => 'super-admin']);

        // Check if the user with email 'admin@gmail.com' already exists
        $user = User::where('email', 'admin@gmail.com')->first();

        if (!$user) {
            // Creating the admin user if it does not already exist
            $user = new User;
            $user->name = 'Admin';
            $user->email = 'admin@gmail.com';
            $user->password = Hash::make('123'); // Use a more secure password in production
            $user->save();

            // Assign the 'admin' role to the user
            $user->assignRole($admin);
        } else {
            // Optionally, update user details if the user exists
            $user->update([
                'name' => 'Admin',
                'password' => Hash::make('123'), // Update the password if necessary
            ]);

            // Ensure the user has the 'admin' role
            if (!$user->hasRole('admin')) {
                $user->assignRole($admin);
            }
        }
    }
}