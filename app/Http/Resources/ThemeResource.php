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
            'pages' => $this->pages ? ThemePageResource::collection(resource: $this->pages) : [],
            'widgets' => $this->widgets ? WidgetResource::collection($this->widgets) : [],
            'partials' => $this->partials ? WidgetResource::collection($this->partials) : [],
            "layouts" => $this->layouts ? WidgetResource::collection($this->layouts) : [],
            "primary_color" => "#1d4ed8",
            "secondary_color" => "#D61F69",
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
