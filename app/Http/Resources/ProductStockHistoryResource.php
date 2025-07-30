<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductStockHistoryResource extends JsonResource
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
            [   'product' => new ProductResource($this->product),
                'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
                'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
            ]
        );
    }
}
