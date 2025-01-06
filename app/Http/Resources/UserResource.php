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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->roles->pluck('name'),
            'registered_store_id' => $this->store_id,
            'phone' => $this->phone,
            'address' => $this->address,
            'image' => $this->user_image,
            'stores' => $this->stores->map(function ($store) { // Changed from store to stores
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'domain' => $store->domain,
                ];
            })
        ];
    }
}
