<?php

namespace App\Http\Resources;

use App\Models\PageType;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThemePageResource extends JsonResource
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
            'title' => $this->title,
            'theme_id' => $this->theme_id,
            'layout' => $this->layout ? new ThemeWidgetResource($this->layout) : null,
            'is_active' => 1,
            'type' => new PageTypeResource(PageType::where(["id" => $this->type])->first()),
            'widgets' => $this->page_widgets ? ThemePageWidgetResource::collection($this->page_widgets) : [],
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
