<?php

namespace App\Modules\CustomerManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get current store ID from context
        $currentStoreId = authStore();
        
        // Get store-specific profile data
        $profile = $this->getProfileForStore($currentStoreId);
        
        return [
            'id' => $this->id,
            'name' => $profile?->effective_name ?? $this->name,
            'email' => $this->email, // Email is always from user table
            'phone' => $profile?->effective_phone ?? $this->phone,
            'address' => $profile?->effective_address ?? $this->address,
            'image' => $this->image,
            
            // Store-specific customer data
            'status' => $profile?->status ?? 'active',
            'notes' => $profile?->notes,
            'has_store_password' => $profile?->hasStorePassword() ?? false,
            'custom_fields' => $profile?->custom_fields,
            
            // Store-specific metrics
            'total_spent' => $profile?->total_spent ?? 0,
            'total_orders' => $profile?->total_orders ?? 0,
            'last_order_at' => $profile?->last_order_at?->format('d M, Y | h:i A'),
            
            // General timestamps
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
            
            // Profile specific timestamps
            'profile_updated_at' => $profile?->updated_at?->format('d M, Y | h:i A'),

            // Authentication info
            'email_verified_at' => $this->email_verified_at?->format('d M, Y | h:i A'),
            'is_verified' => $this->isVerified(),
        ];
    }
}