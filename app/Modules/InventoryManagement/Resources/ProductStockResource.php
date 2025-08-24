<?php

namespace App\Modules\InventoryManagement\Resources;

use App\Modules\InventoryManagement\Resources\ProductStockItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductStockResource extends JsonResource
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
                'stock_items' => count($this->items) > 0 ? ProductStockItemResource::collection($this->items) : [],
                'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
                'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
            ]
        );
    }
}
