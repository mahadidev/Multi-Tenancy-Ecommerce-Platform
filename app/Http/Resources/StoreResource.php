<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
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
            'slug' => $this->slug,
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'status' => $this->status,
            'description' => $this->description,
            'currency' => $this->currency ?? 'BDT',
            'logos' => [
                'primary' => $this->logo_image,
                'dark' =>  $this->dark_logo_image,
            ],
            'settings' => $this->settings
        ];
    }
}
