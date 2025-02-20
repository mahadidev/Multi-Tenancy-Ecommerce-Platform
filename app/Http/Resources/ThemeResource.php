<?php

namespace App\Http\Resources;

use App\Models\PageType;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThemeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail_image,
            'is_active' => $this->is_active,
            'pages' => $this->pages ? ThemePageResource::collection($this->pages) : [],
            'widgets' => $this->widgets ? WidgetResource::collection($this->widgets) : [],

        ];
    }
}
