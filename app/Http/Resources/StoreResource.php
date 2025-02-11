<?php

namespace App\Http\Resources;

use App\Models\Theme;
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
            'store_type' => $this->storeType ? StoreTypeResource::make($this->storeType) : null,
            'theme_id' => $this->theme_id,
            "theme" => $this->theme_id ? new ThemeResource(Theme::where(["id" => $this->theme_id])->first()) : null,
            'settings' => $this->settings !== "null" ? $this->settings : null,
            'social_media' => $this->socialMedia ? StoreSocialMediaResource::collection($this->socialMedia) : [],
            'categories' => $this->categories ? CategoryResource::collection($this->categories) : [],
            'brands' => $this->brands ? BrandResource::collection($this->brands) : [],
            'widgets' => $this->widgets ?  StoreWidgetResource::collection($this->widgets) : [],
            'pages' => $this->pages ? StorePagesResource::collection($this->pages) : [],
            'menus' => $this->menus ? StoreMenuResource::collection($this->menus) : [],
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
