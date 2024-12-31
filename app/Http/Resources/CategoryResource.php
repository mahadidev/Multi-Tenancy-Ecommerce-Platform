<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'user_id' => $this->user_id,
            'store_id' => $this->store_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'has_parent' => $this->parent
                ? [
                    'id' => $this->id,
                    'name' => $this->name,
                    'slug' => $this->slug,
                ]
                : null,
        ];
    }
}
