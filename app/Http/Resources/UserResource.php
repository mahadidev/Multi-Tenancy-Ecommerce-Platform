<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get current user's custom roles and permissions
        $userRoles = $this->userRoles()->with('role.permissions')->get();
        $roleNames = $userRoles->pluck('role.name')->filter()->values();
        
        // Extract all permissions from user's roles
        $permissions = $userRoles->flatMap(function ($userRole) {
            return $userRole->role ? $userRole->role->permissions->pluck('slug') : collect();
        })->unique()->values();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $roleNames,
            'permissions' => $permissions,

            // email_verified is null if the user email is not verified
            'email_verified_at' => $this->email_verified_at ? date('d M, Y | h:i A', strtotime($this->email_verified_at)) : null,

            // Include 'registered_store_id' only if the user has the 'user' role
            'registered_store_id' => $this->when(
                $roleNames->contains('user'),
                $this->store_id
            ),
            'phone' => $this->phone,
            'address' => $this->address,
            'image' => $this->user_image,

            // Include 'stores' only if the user has the 'seller' role
            'stores' => $this->when(
                $roleNames->contains('seller') || $this->ownedStores()->exists(),
                $this->ownedStores->map(function ($store) {
                    return [
                        'id' => $store->id,
                        'name' => $store->name,
                        'domain' => $store->domain,
                    ];
                })
            ),

            // Include 'store_session' only if the user_id is exists in the store_session table
            'store_session' => $this->when(
                !is_null($this->storeSession),
                fn() => [
                    'store_id' => $this->storeSession->store_id,
                    'store_name' => optional($this->storeSession->store)->name,
                    'store_domain' => optional($this->storeSession->store)->domain,
                    'is_owner' => optional($this->storeSession->store)->owner_id === $this->id,
                ]
            ),
            
            // Include is_store_owner for current store context
            'is_store_owner' => $this->when(
                !is_null($this->storeSession),
                fn() => optional($this->storeSession->store)->owner_id === $this->id
            ),
        ];
    }
}
