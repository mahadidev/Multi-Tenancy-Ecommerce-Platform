<?php

namespace App\Modules\ThemeManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WidgetResource extends JsonResource
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
            'name' => $this->name ?? null,
            'slug' => $this->slug ?? null,
            'type' => $this->type ?? null,
            'component' => $this->component ?? null,
            'props' => $this->props ?? [],
            'settings' => $this->settings ?? [],
            'is_active' => $this->is_active ?? true,
            'created_at' => $this->created_at ? date('d M, Y | h:i A', strtotime($this->created_at)) : null,
            'updated_at' => $this->updated_at ? date('d M, Y | h:i A', strtotime($this->updated_at)) : null,
        ];
    }
}