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
            'domain' => $this->domain(),
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'status' => $this->status,
            'type' => $this->type,
            'description' => $this->description,
            'currency' => $this->currency ?? 'BDT',
            'logos' => [
                'primary' => $this->logo_image,
                'dark' => $this->dark_logo_image,
            ],
            'primary_color' => $this->primary_color,
            'secondary_color' => $this->secondary_color,
            'theme_id' => $this->theme_id,
            'settings' => $this->settings !== "null" ? json_decode($this->settings) : null,
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
