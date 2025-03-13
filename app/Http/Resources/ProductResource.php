<?php

namespace App\Http\Resources;

use App\Http\Resources\ProductVariantResource;
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
            'short_description' => $this->short_description,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail_image ? $this->thumbnail_image : 'https://placehold.co/600x400',
            'attachments' => $this->attachments_image,
            'category' => new CategoryResource($this->category),
            'brand' => new BrandResource($this->brand),
            'has_in_stocks' => $this->has_in_stocks,
            'stock' => $this->stock,
            'status' => $this->status,
            'store' => $this->store ? ['id' => $this->store->id , 'name' => $this->store->name , 'slug' => $this->store->slug  ] : null,
            'variants' => $this->variants->isNotEmpty() ? ProductVariantResource::collection($this->variants) : null,
            'is_featured' => $this->is_featured,
            'is_trending' => $this->is_trending,
            'has_discount' => $this->has_discount,
            'discount_to' => $this->discount_to,
            'discount_type' => $this->discount_type,
            'discount_amount' => $this->discount_amount,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
        ];
    }
}
