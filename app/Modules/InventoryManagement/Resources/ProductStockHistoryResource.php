<?php

namespace App\Modules\InventoryManagement\Resources;

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
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_stock_id' => $this->product_stock_id,
            'qty' => $this->qty,
            'price' => $this->price,
            'discount_amount' => $this->discount_amount,
            'buying_price' => $this->buying_price,
            'tax' => $this->tax,
            'note' => $this->note,
            'type' => $this->type,
            'created_at' => date('d M, Y | h:i A', strtotime($this->created_at)),
            'updated_at' => date('d M, Y | h:i A', strtotime($this->updated_at)),
            'product' => $this->when(isset($this->product), [
                'id' => $this->product?->id,
                'name' => $this->product?->name,
                'thumbnail' => $this->product?->thumbnail,
                'price' => $this->product?->price,
                'sku' => $this->product?->sku,
                'stockBuyingValue' => $this->product?->stockBuyingValue ?? $this->buying_price ?? 0,
                'stockValue' => $this->product?->stockValue ?? $this->price ?? $this->product?->price ?? 0,
            ]),
        ];
    }
}
