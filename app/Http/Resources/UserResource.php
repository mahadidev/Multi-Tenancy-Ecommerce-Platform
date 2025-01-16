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

            // Include 'registered_store_id' only if the user has the 'user' role
            'registered_store_id' => $this->when(
                $this->roles->pluck('name')->contains('user'),
                $this->store_id
            ),
            'phone' => $this->phone,
            'address' => $this->address,
            'image' => $this->user_image,

            // Include 'stores' only if the user has the 'seller' role
            'stores' => $this->when(
                $this->roles->pluck('name')->contains('seller'),
                $this->stores->map(function ($store) {
                    return [
                        'id' => $store->id,
                        'name' => $store->name,
                        'domain' => $store->domain,
                    ];
                })
            ),
        ];
    }
}
