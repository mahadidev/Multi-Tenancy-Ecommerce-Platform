<?php

namespace App\Modules\ThemeManagement\Resources;

use App\Models\PageType;
use App\Models\Widget;
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
            'layout' => $this->layout_id ? WidgetResource::make(Widget::find($this->layout_id)) : null,
            'is_active' => 1,
            'type' => new PageTypeResource(PageType::where(["id" => $this->type])->first()),
            'widgets' => $this->widgets ? WidgetResource::collection($this->widgets) : [],
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
