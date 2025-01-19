<?php

namespace App\Http\Resources;

use App\Models\PageType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StorePagesResource extends JsonResource
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
            'title' => $this->title,
            'is_active' => $this->is_active,
            'type' => new PageTypeResource(PageType::where(["id" => $this->type])->first()),
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
            'widgets' => $this->widgets ? StorePageWidgetsResource::collection($this->widgets) : []
        ];
    }
}
