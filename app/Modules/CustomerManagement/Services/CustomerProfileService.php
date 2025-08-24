<?php

namespace App\Modules\CustomerManagement\Services;

use App\Modules\CustomerManagement\Models\CustomerProfile;
use App\Modules\UserManagement\Models\User;
use Illuminate\Support\Facades\Hash;

class CustomerProfileService
{
    /**
     * Get or create customer profile for user in specific store
     */
    public function getOrCreateProfile(User $user, int $storeId): CustomerProfile
    {
        return $user->customerProfiles()->firstOrCreate(
            ['store_id' => $storeId],
            ['status' => 'active']
        );
    }

    /**
     * Update customer profile for specific store
     */
    public function updateProfile(User $user, int $storeId, array $data): CustomerProfile
    {
        $profile = $this->getOrCreateProfile($user, $storeId);
        
        // Only update fields that are different from user's global data
        $updateData = [];
        
        if (isset($data['name']) && $data['name'] !== $user->name) {
            $updateData['display_name'] = $data['name'];
        }
        
        if (isset($data['phone']) && $data['phone'] !== $user->phone) {
            $updateData['phone'] = $data['phone'];
        }
        
        if (isset($data['address']) && $data['address'] !== $user->address) {
            $updateData['address'] = $data['address'];
        }
        
        // These are always store-specific
        if (isset($data['notes'])) {
            $updateData['notes'] = $data['notes'];
        }
        
        if (isset($data['status'])) {
            $updateData['status'] = $data['status'];
        }
        
        if (isset($data['custom_fields'])) {
            $updateData['custom_fields'] = $data['custom_fields'];
        }

        if (!empty($updateData)) {
            $profile->update($updateData);
        }

        return $profile;
    }

    /**
     * Set store-specific password for customer
     */
    public function setStorePassword(User $user, int $storeId, string $password): CustomerProfile
    {
        $profile = $this->getOrCreateProfile($user, $storeId);
        $profile->setStorePassword($password);
        return $profile;
    }

    /**
     * Verify customer password for specific store
     */
    public function verifyPassword(User $user, int $storeId, string $password): bool
    {
        $profile = $user->getProfileForStore($storeId);
        
        if ($profile && $profile->hasStorePassword()) {
            return $profile->checkPassword($password);
        }
        
        // Fallback to user's global password
        return Hash::check($password, $user->password);
    }

    /**
     * Get effective customer data for specific store
     */
    public function getEffectiveData(User $user, int $storeId): array
    {
        $profile = $user->getProfileForStore($storeId);
        
        return [
            'id' => $user->id,
            'name' => $profile?->effective_name ?? $user->name,
            'email' => $user->email,
            'phone' => $profile?->effective_phone ?? $user->phone,
            'address' => $profile?->effective_address ?? $user->address,
            'image' => $user->image,
            'status' => $profile?->status ?? 'active',
            'notes' => $profile?->notes,
            'has_store_password' => $profile?->hasStorePassword() ?? false,
            'total_spent' => $profile?->total_spent ?? 0,
            'total_orders' => $profile?->total_orders ?? 0,
            'last_order_at' => $profile?->last_order_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'profile_updated_at' => $profile?->updated_at,
        ];
    }

    /**
     * Update customer metrics after order
     */
    public function updateMetrics(User $user, int $storeId, float $orderAmount = 0): void
    {
        $profile = $this->getOrCreateProfile($user, $storeId);
        $profile->updateMetrics($orderAmount);
    }

    /**
     * Check if customer is blocked in specific store
     */
    public function isBlocked(User $user, int $storeId): bool
    {
        $profile = $user->getProfileForStore($storeId);
        return $profile?->isBlocked() ?? false;
    }

    /**
     * Block/unblock customer in specific store
     */
    public function setCustomerStatus(User $user, int $storeId, string $status): CustomerProfile
    {
        $profile = $this->getOrCreateProfile($user, $storeId);
        $profile->update(['status' => $status]);
        return $profile;
    }
}