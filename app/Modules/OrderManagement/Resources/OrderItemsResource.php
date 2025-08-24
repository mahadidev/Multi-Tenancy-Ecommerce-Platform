<?php

namespace App\Modules\OrderManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemsResource extends JsonResource
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
                'product' => $this->product,
                'stock' => $this->stock
            ]
        );
    }
}
