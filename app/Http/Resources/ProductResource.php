<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'sku' => $this->sku,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail_image,
            'attachments' => $this->attachments_image,
            'price' => $this->price,
            'category' => new CategoryResource($this->category),
            'brand' => new BrandResource($this->brand),
            'has_in_stocks' => $this->has_in_stocks,
            'stock' => $this->stock,
            'status' => $this->status,
            'store' => $this->store ? ['id' => $this->store->id , 'name' => $this->store->name , 'slug' => $this->store->slug  ] : null,
            'variants' => $this->variants->isNotEmpty() ? $this->variants : null,
        ];
    }
}