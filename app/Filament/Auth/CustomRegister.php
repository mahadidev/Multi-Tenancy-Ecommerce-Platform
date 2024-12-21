<?php

namespace App\Filament\Auth;

use Filament\Pages\Auth\Register;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Model;

class CustomRegister extends Register
{
    protected function handleRegistration(array $data): Model
    {
        // Check if the 'seller' role exists, and create it if not
        $sellerRole = Role::firstOrCreate(['name' => 'seller']);

        $user = $this->getUserModel()::create($data);
        $user->update(['email_verified_at' => now()]);
        $user->assignRole($sellerRole);

        return $user;
    }
}
