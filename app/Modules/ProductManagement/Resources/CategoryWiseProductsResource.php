<?php

namespace App\Modules\ProductManagement\Resources;

use App\Modules\ProductManagement\Resources\CategoryResource;
use App\Modules\ProductManagement\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryWiseProductsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'category' => new CategoryResource($this), // Use CategoryResource for category details
            'products' => ProductResource::collection($this->whenLoaded('product')), // Use ProductResource for products
        ];
    }
}
