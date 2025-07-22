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
        return array_merge(
            parent::toArray($request), // or $this->resource->toArray()
            [
                'thumbnail' => $this->thumbnail_image ? $this->thumbnail_image : 'https://placehold.co/600x400',
                'attachments' => $this->attachments_image,
                'category' => new CategoryResource($this->category),
                'brand' => new BrandResource($this->brand),
                'stockQty' => $this->stockQty(),
                'store' => $this->store ? ['id' => $this->store->id , 'name' => $this->store->name , 'slug' => $this->store->slug  ] : null,
                'variants' => $this->variants->isNotEmpty() ? ProductVariantResource::collection($this->variants) : null,
                'stocks' => $this->stocks->isNotEmpty() ? ProductStockResource::collection($this->stocks) : null,
                'discount_price' => $this->calculateDiscountPrice(),
                'discount_amount' => $this->discount_amount ?? 0,
                'variantStocks' => $this->totalVariantStock(),
                'variantValue' => $this->totalVariantValue(),
                'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
                'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
            ]
        );
    }
}
