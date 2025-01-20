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
            'logo' => $this->logo_image,
            "dark_logo" => $this->dark_logo_image,
            'primary_color' => $this->primary_color,
            'secondary_color' => $this->secondary_color,
            'theme_id' => $this->theme_id,
            'settings' => $this->settings !== "null" ? $this->settings : null,
            'social_media' => $this->socialMedia ? StoreSocialMediaResource::collection($this->socialMedia) : [],
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
