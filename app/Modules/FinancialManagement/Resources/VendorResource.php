<?php

namespace App\Modules\FinancialManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
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
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'description' => $this->description,
            'contact_person' => $this->contact_person,
            'store_id' => $this->store_id,
            'store' => $this->whenLoaded('store', function () {
                return [
                    'id' => $this->store->id,
                    'name' => $this->store->name,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'created_at_human' => $this->created_at_human,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_at_human' => $this->updated_at_human,
        ];
    }
}