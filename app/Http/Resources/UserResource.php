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

            // Include 'store_session' only if the user_id is exists in the store_session table
            'store_session' => $this->when(
                !is_null($this->storeSession),
                fn() => [
                    'store_id' => $this->storeSession->store_id,
                    'store_name' => optional($this->storeSession->store)->name,
                    'store_domain' => optional($this->storeSession->store)->domain,
                ]
            ),
        ];
    }
}
